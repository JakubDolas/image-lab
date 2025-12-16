import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { buildCssFilter } from "@/features/editor/types";
import { useDrawingCanvas } from "../drawing/useDrawingCanvas";

import { Dropzone } from "./Dropzone";
import { BusyOverlay } from "./BusyOverlay";
import { ViewportImage } from "./viewPortImage";
import { useViewportImage } from "./useViewportImage";
import type {
  CanvasViewportProps,
  CanvasViewportHandle,
} from "./viewport.types";

export const CanvasViewport = forwardRef<
  CanvasViewportHandle,
  CanvasViewportProps
>(function CanvasViewport(
  {
    imageUrl,
    onPickFile,
    filters,
    cropEnabled,
    cropRect,
    onChangeCropRect,
    zoom,
    busy,
    drawingMode,
    brushSize,
    brushColor,
    onApplyDrawing,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    imgRef,
    drawCanvasRef,
    drawingActive,
    handleImageLoad,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    applyDrawing,
    clearDrawing,
  } = useDrawingCanvas({
    drawingMode,
    brushSize,
    brushColor,
    cropEnabled,
  });

  const {
    imgDim,
    baseScale,
    onImageLoad,
  } = useViewportImage(containerRef, handleImageLoad);

  const cssFilter = useMemo(() => buildCssFilter(filters), [filters]);
  const effectiveScale = baseScale * zoom;

  useImperativeHandle(ref, () => ({
    applyDrawing: () =>
      applyDrawing(cssFilter, onApplyDrawing),
    cancelDrawing: clearDrawing,
  }));

  return (
    <Dropzone onPickFile={onPickFile}>
      <div
        ref={containerRef}
        className="
          relative
          h-[78vh] w-full
          rounded-2xl
          border-2 border-dashed border-white/10
          bg-black/20
          overflow-auto
          grid place-items-center
          nice-scrollbar
        "
      >
        {imageUrl ? (
          <ViewportImage
            imageUrl={imageUrl}
            cssFilter={cssFilter}
            imgRef={imgRef}
            canvasRef={drawCanvasRef}
            imgDim={imgDim}
            scale={effectiveScale}
            cropEnabled={cropEnabled}
            cropRect={cropRect}
            onChangeCropRect={onChangeCropRect}
            drawingActive={drawingActive}
            drawingMode={drawingMode}
            onImageLoad={onImageLoad}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
        ) : (
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-2">
              Przeciągnij obraz tutaj albo kliknij
            </div>
            <div className="text-indigo-400 underline underline-offset-4 font-medium">
              wybierz z dysku
            </div>
          </div>
        )}

        {busy && <BusyOverlay />}
      </div>
    </Dropzone>
  );
});
