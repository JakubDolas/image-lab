import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { Filters, CropRect } from "@/features/editor/types";
import { CanvasViewport, type CanvasViewportHandle } from "./CanvasViewport";
import { ZoomPanel } from "./ZoomPanel";
import { useZoom } from "./useZoom";

type Props = {
  imageUrl: string | null;
  onPickFile: (file: File) => void;
  filters: Filters;
  cropEnabled: boolean;
  cropRect: CropRect | null;
  onChangeCropRect: (rect: CropRect) => void;
  busy: boolean;

  drawingMode: "off" | "draw" | "erase";
  brushSize: number;
  brushColor: string;

  onApplyDrawing: (blob: Blob) => void;
};

export type CanvasHandle = {
  applyDrawing: () => void;
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const STEP_ZOOM = 0.25;

const Canvas = forwardRef<CanvasHandle, Props>(function CanvasInner(
  {
    imageUrl,
    onPickFile,
    filters,
    cropEnabled,
    cropRect,
    onChangeCropRect,
    busy,
    drawingMode,
    brushSize,
    brushColor,
    onApplyDrawing,
  }: Props,
  ref
) {
  const {
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    minZoom,
    maxZoom,
  } = useZoom({ min: MIN_ZOOM, max: MAX_ZOOM, step: STEP_ZOOM });

  const viewportRef = useRef<CanvasViewportHandle | null>(null);

  useEffect(() => {
    setZoom(1);
  }, [imageUrl, setZoom]);

  useImperativeHandle(ref, () => ({
    applyDrawing() {
      viewportRef.current?.applyDrawing();
    },
  }));

  return (
    <div className="relative flex-1">
      <CanvasViewport
        ref={viewportRef}
        imageUrl={imageUrl}
        onPickFile={onPickFile}
        filters={filters}
        cropEnabled={cropEnabled}
        cropRect={cropRect}
        onChangeCropRect={onChangeCropRect}
        zoom={zoom}
        busy={busy}
        drawingMode={drawingMode}
        brushSize={brushSize}
        brushColor={brushColor}
        onApplyDrawing={onApplyDrawing}
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
});

export default Canvas;
