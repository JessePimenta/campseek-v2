import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { ReleaseData } from '../../types/Release';
import { parseLocation } from '../../utils/locationUtils';

interface MapViewProps {
  releases: ReleaseData[];
  currentlyPlaying: string | null;
  playHistory: Set<string>;
  onPlayToggle: (streamingUrl: string) => void;
}

export const MapView = forwardRef<{ centerOnRelease: (release: ReleaseData) => void }, MapViewProps>(
  ({ releases, currentlyPlaying, playHistory, onPlayToggle }, ref) => {
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.MarkerClusterGroup | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
    const [isMapInitialized, setIsMapInitialized] = useState(false);
    const currentPopupRef = useRef<L.Popup | null>(null);
    const openMarkerRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      centerOnRelease: (release: ReleaseData) => {
        const coords = parseLocation(release.release.location);
        if (coords && mapRef.current) {
          const marker = markersMapRef.current.get(release.release.streaming_url);
          
          mapRef.current.setView([coords.lat, coords.lng], 10, {
            animate: true,
            duration: 1
          });

          setTimeout(() => {
            if (marker) {
              createAndOpenPopup(marker, release);
              openMarkerRef.current = release.release.streaming_url;
            }
          }, 1000);
        }
      }
    }));

    const createPopupContent = (releaseData: ReleaseData) => {
      const isPlaying = currentlyPlaying === releaseData.release.streaming_url;
      
      const popupContent = document.createElement('div');
      popupContent.className = 'release-popup';
      popupContent.innerHTML = `
        <div class="flex flex-col items-center space-y-2">
          <div class="relative w-full cursor-pointer release-image">
            <img
              src="${releaseData.release.image_url}"
              alt="${releaseData.release.title}"
              class="w-full h-36 object-cover rounded"
            />
            <button class="play-button">
              ${isPlaying ? `
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="4" height="14" fill="white"/>
                  <rect x="8" width="4" height="14" fill="white"/>
                </svg>
              ` : `
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 7L0 13.9282L0 0.0717969L12 7Z" fill="white"/>
                </svg>
              `}
            </button>
          </div>
          <div class="text-center">
            <h3 class="font-medium text-base">
              <a href="${releaseData.release.url}" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600">
                ${releaseData.release.title}
              </a>
            </h3>
            <p class="text-xs text-gray-400">by ${releaseData.release.artist}</p>
            <p class="text-xs pt-2 text-gray-400">
              from <a href="${releaseData.collected_by.bandcamp_url}" target="_blank" rel="noopener noreferrer" class="underline">
                ${releaseData.collected_by.name}'s collection
              </a>
            </p>
          </div>
        </div>
      `;

      const imageContainer = popupContent.querySelector('.release-image');
      if (imageContainer) {
        imageContainer.addEventListener('click', (e) => {
          e.stopPropagation();
          onPlayToggle(releaseData.release.streaming_url);
        });
      }

      return popupContent;
    };

    const createAndOpenPopup = (marker: L.Marker, releaseData: ReleaseData) => {
      if (currentPopupRef.current) {
        currentPopupRef.current.remove();
      }

      const popup = L.popup({
        closeButton: false,
        className: 'custom-popup',
        maxWidth: 280,
        minWidth: 280,
        autoClose: true,
        closeOnClick: false
      }).setContent(createPopupContent(releaseData));

      popup.on('remove', () => {
        if (openMarkerRef.current === releaseData.release.streaming_url) {
          openMarkerRef.current = null;
        }
      });

      currentPopupRef.current = popup;
      marker.bindPopup(popup).openPopup();
      openMarkerRef.current = releaseData.release.streaming_url;
    };

    useEffect(() => {
      if (!containerRef.current || isMapInitialized) return;

      const isMobile = window.innerWidth < 768;
      const initialZoom = isMobile ? 1 : 2;
      const initialCenter = isMobile ? [30, 0] : [20, 0];

      mapRef.current = L.map(containerRef.current, {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
        zoomControl: true
      }).setView(initialCenter, initialZoom);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapRef.current);

      markersRef.current = L.markerClusterGroup({
        maxClusterRadius: 30,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyDistanceMultiplier: 1.5,
        spiderLegPolylineOptions: {
          weight: 1.5,
          color: '#fff',
          opacity: 0.5
        }
      }).addTo(mapRef.current);

      const handleResize = () => {
        if (mapRef.current) {
          const isMobile = window.innerWidth < 768;
          const newZoom = isMobile ? 1 : 2;
          const newCenter = isMobile ? [30, 0] : [20, 0];
          mapRef.current.setView(newCenter, newZoom, { animate: true });
        }
      };

      window.addEventListener('resize', handleResize);
      setIsMapInitialized(true);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          markersRef.current = null;
          markersMapRef.current.clear();
          currentPopupRef.current = null;
          setIsMapInitialized(false);
        }
      };
    }, []);

    useEffect(() => {
      if (!markersRef.current || !isMapInitialized) return;

      // Store the currently open marker's streaming URL before clearing
      const openMarkerUrl = openMarkerRef.current;

      markersRef.current.clearLayers();
      markersMapRef.current.clear();

      const markers = releases.map(releaseData => {
        const coords = parseLocation(releaseData.release.location);
        if (!coords) return null;

        const isPlaying = currentlyPlaying === releaseData.release.streaming_url;
        const wasPlayed = playHistory.has(releaseData.release.streaming_url);

        const markerIcon = L.divIcon({
          className: `custom-marker ${isPlaying ? 'playing' : ''} ${wasPlayed ? 'visited' : ''}`,
          html: '<div class="marker-dot"></div>',
          iconSize: [12, 12]
        });

        const marker = L.marker([coords.lat, coords.lng], { icon: markerIcon })
          .on('click', () => {
            createAndOpenPopup(marker, releaseData);
          });

        markersMapRef.current.set(releaseData.release.streaming_url, marker);
        
        return marker;
      }).filter((marker): marker is L.Marker => marker !== null);

      if (markers.length > 0) {
        markersRef.current.addLayers(markers);
      }

      // Reopen the popup that was open before if it still exists
      if (openMarkerUrl) {
        const marker = markersMapRef.current.get(openMarkerUrl);
        const release = releases.find(r => r.release.streaming_url === openMarkerUrl);
        if (marker && release) {
          createAndOpenPopup(marker, release);
        }
      }

      // Handle currently playing marker
      if (currentlyPlaying && !openMarkerUrl) {
        const currentMarker = markersMapRef.current.get(currentlyPlaying);
        const currentRelease = releases.find(r => r.release.streaming_url === currentlyPlaying);
        if (currentMarker && currentRelease) {
          createAndOpenPopup(currentMarker, currentRelease);
        }
      }
    }, [releases, currentlyPlaying, playHistory, onPlayToggle, isMapInitialized]);

    return (
      <div className="flex justify-center w-full">
        <div ref={containerRef} className="h-[580px] w-full max-w-[1100px] rounded-lg overflow-hidden shadow-lg" />
      </div>
    );
  }
);

MapView.displayName = 'MapView';