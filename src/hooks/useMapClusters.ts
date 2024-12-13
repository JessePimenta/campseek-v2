import { useMemo } from 'react';
import Supercluster from 'supercluster';
import type { ReleaseData } from '../types/Release';
import { parseLocation } from '../utils/locationUtils';

interface ClusterProperties {
  cluster: boolean;
  point_count: number;
  releases: ReleaseData[];
}

export function useMapClusters(releases: ReleaseData[], zoom: number) {
  return useMemo(() => {
    // Filter releases with valid locations and create GeoJSON features
    const points = releases
      .map(release => {
        const coords = parseLocation(release.release.location);
        if (!coords) return null;

        return {
          type: 'Feature',
          properties: {
            cluster: false,
            point_count: 1,
            releases: [release]
          },
          geometry: {
            type: 'Point',
            coordinates: [coords.lng, coords.lat]
          }
        } as const;
      })
      .filter((point): point is NonNullable<typeof point> => point !== null);

    // Initialize supercluster
    const index = new Supercluster<ClusterProperties>({
      radius: 40,
      maxZoom: 16
    });

    // Load points into the index
    index.load(points);

    // Get clusters for current viewport
    const clusters = index.getClusters([-180, -85, 180, 85], Math.floor(zoom));

    return clusters;
  }, [releases, zoom]);
}