interface Env {
  VITE_MAPBOX_TOKEN: string;
}

export const env: Env = {
  VITE_MAPBOX_TOKEN: import.meta.env.VITE_MAPBOX_TOKEN || ''
};