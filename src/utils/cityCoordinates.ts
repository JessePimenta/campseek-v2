interface Coordinates {
  lat: number;
  lng: number;
}

export const CITY_COORDINATES: Record<string, Coordinates> = {
  'Berlin, Germany': { lat: 52.5200, lng: 13.4050 },
  'Copenhagen, Denmark': { lat: 55.6761, lng: 12.5683 },
  'London, UK': { lat: 51.5074, lng: -0.1278 },
  'New York, NY': { lat: 40.7128, lng: -74.0060 },
  'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
  'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
  'Tokyo, Japan': { lat: 35.6762, lng: 139.6503 },
  'Paris, France': { lat: 48.8566, lng: 2.3522 },
  'Amsterdam, Netherlands': { lat: 52.3676, lng: 4.9041 },
  'Barcelona, Spain': { lat: 41.3851, lng: 2.1734 },
  // ... rest of the city coordinates
}