import { useState, useCallback } from "react";

type Config = {
  min: number;
  max: number;
  step: number;
};

export function useZoom({ min, max, step }: Config) {
  const [zoom, setZoom] = useState(1);

  const fix = (num: number) => parseFloat(num.toFixed(2));

  const clamp = useCallback(
    (z: number) => Math.min(max, Math.max(min, z)),
    [min, max]
  );

  const zoomIn = useCallback(() => {
    setZoom((prev) => {
      const next = fix(prev + step);
      return clamp(next);
    });
  }, [clamp, step]);

  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = fix(prev - step);
      return clamp(next);
    });
  }, [clamp, step]);

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