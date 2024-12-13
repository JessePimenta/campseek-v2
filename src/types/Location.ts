export interface Location {
  city?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface LocationResponse {
  location: Location;
  raw_location: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}