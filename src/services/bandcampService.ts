import { ReleaseData } from '../types/Release';
import { parseLocation } from '../utils/locationUtils';

async function fetchReleaseTitle(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Extract og:title meta tag content
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    if (titleMatch && titleMatch[1]) {
      // Remove "| Bandcamp" if present and trim
      return titleMatch[1].replace(/\s*\|\s*Bandcamp$/, '').trim();
    }
    return '';
  } catch (error) {
    console.error('Error fetching release title:', error);
    return '';
  }
}

export async function streamBandcampData(
  url: string, 
  onRelease: (release: ReleaseData) => void, 
  onSourceRelease?: (release: ReleaseData) => void
) {
  // First fetch the title
  const title = await fetchReleaseTitle(url);
  if (title && onSourceRelease) {
    onSourceRelease({ 
      release: { 
        title,
        // Provide minimal required fields
        artist: '',
        url: '',
        image_url: '',
        streaming_url: '',
        location: '',
        release_type: '',
        release_date: '',
        genres: []
      },
      collected_by: {
        name: '',
        bandcamp_url: ''
      }
    });
  }

  const response = await fetch('https://map.deejay.tools/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream'
    },
    body: JSON.stringify({ url })
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  
  // Keep track of supporters we've seen to limit releases per supporter
  const supporterReleaseCount = new Map<string, number>();
  const maxReleasesPerSupporter = 20;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data.startsWith(':')) continue;
        
        try {
          const releaseData = JSON.parse(data) as ReleaseData;
          
          // Only process if location can be parsed
          const coords = parseLocation(releaseData.release.location);
          if (!coords) continue;

          const supporterId = releaseData.collected_by.bandcamp_url;
          
          // Get current count for this supporter
          const currentCount = supporterReleaseCount.get(supporterId) || 0;
          
          // Only emit if we haven't hit the limit for this supporter
          if (currentCount < maxReleasesPerSupporter) {
            // Add some randomization - 90% chance to emit the release
            if (Math.random() < 0.9) {
              onRelease(releaseData);
              supporterReleaseCount.set(supporterId, currentCount + 1);
            }
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      }
    }
  }
}