export interface Release {
  title: string;
  artist: string;
  url: string;
  image_url: string;
  streaming_url: string;
  location: string;
  release_type: string;
  release_date: string;
  genres: string[];
}

export interface CollectedBy {
  name: string;
  bandcamp_url: string;
}

export interface ReleaseData {
  release: Release;
  collected_by: CollectedBy;
}