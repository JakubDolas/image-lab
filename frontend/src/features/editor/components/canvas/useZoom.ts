import { useState, useCallback } from "react";

type Config = {
  min: number;
  max: number;
  step: number;
};

export function useZoom({ min, max, step }: Config) {
  const [zoom, setZoom] = useState(1);

  const clamp = useCallback(
    (z: number) => Math.min(max, Math.max(min, z)),
    [min, max]
  );

  const zoomIn = useCallback(
    () => setZoom((z) => clamp(z + step)),
    [clamp, step]
  );

  const zoomOut = useCallback(
    () => setZoom((z) => clamp(z - step)),
    [clamp, step]
  );

  const resetZoom = useCallback(() => setZoom(1), []);

  return {
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    minZoom: min,
    maxZoom: max,
  };
}
