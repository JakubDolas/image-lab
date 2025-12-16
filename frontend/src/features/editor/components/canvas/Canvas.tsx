import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import { CanvasViewport } from "./viewport/CanvasViewport";
import type { CanvasViewportHandle } from "./viewport/viewport.types";
import { ZoomPanel } from "./zoom/ZoomPanel";
import { useZoom } from "./zoom/useZoom";

import { ZOOM_CONFIG } from "./zoom/zoom.constants";
import type { CanvasHandle, CanvasProps } from "./canvas.types";

const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas(
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
  },
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
  } = useZoom(ZOOM_CONFIG);

  const viewportRef = useRef<CanvasViewportHandle | null>(null);

  useEffect(() => {
    setZoom(1);
  }, [imageUrl, setZoom]);

  useImperativeHandle(ref, () => ({
    applyDrawing: () => viewportRef.current?.applyDrawing(),
    cancelDrawing: () => viewportRef.current?.cancelDrawing(),
  }));

  return (
    <div className="relative flex-1 h-full w-full overflow-hidden bg-slate-900/50">
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
