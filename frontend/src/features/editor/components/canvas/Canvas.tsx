import { useEffect } from "react";
import type { Filters, CropRect } from "@/features/editor/types";
import { CanvasViewport } from "./CanvasViewport";
import { ZoomPanel } from "./ZoomPanel";
import { useZoom } from "./useZoom";

type Props = {
  imageUrl: string | null;
  onPickFile: (file: File) => void;
  filters: Filters;
  cropEnabled: boolean;
  cropRect: CropRect | null;
  onChangeCropRect: (rect: CropRect) => void;
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const STEP_ZOOM = 0.25;

export default function Canvas({
  imageUrl,
  onPickFile,
  filters,
  cropEnabled,
  cropRect,
  onChangeCropRect,
}: Props) {
  const {
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    minZoom,
    maxZoom,
  } = useZoom({ min: MIN_ZOOM, max: MAX_ZOOM, step: STEP_ZOOM });

  useEffect(() => {
    setZoom(1);
  }, [imageUrl, setZoom]);

  return (
    <div className="relative flex-1">
      <CanvasViewport
        imageUrl={imageUrl}
        onPickFile={onPickFile}
        filters={filters}
        cropEnabled={cropEnabled}
        cropRect={cropRect}
        onChangeCropRect={onChangeCropRect}
        zoom={zoom}
      />

      {imageUrl && (
        <ZoomPanel
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={resetZoom}
        />
      )}
    </div>
  );
}
