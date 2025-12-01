import {
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import type {
  DragEvent,
} from "react";
import type { Filters, CropRect } from "@/features/editor/types";
import { buildCssFilter } from "@/features/editor/types";
import { CropOverlay } from "./CropOverlay";
import { useDrawingCanvas } from "./useDrawingCanvas";

type DrawingMode = "off" | "draw" | "erase";

type Props = {
  imageUrl: string | null;
  onPickFile: (file: File) => void;
  filters: Filters;
  cropEnabled: boolean;
  cropRect: CropRect | null;
  onChangeCropRect: (rect: CropRect) => void;
  zoom: number;
  busy: boolean;

  drawingMode: DrawingMode;
  brushSize: number;
  brushColor: string;

  onApplyDrawing: (blob: Blob) => void;
};

export type CanvasViewportHandle = {
  applyDrawing: () => void;
};

export const CanvasViewport = forwardRef<CanvasViewportHandle, Props>(
  function CanvasViewportInner(
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
    }: Props,
    ref
  ) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const {
      imgRef,
      drawCanvasRef,
      drawingActive,
      handleImageLoad,
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
      applyDrawing: applyDrawingInternal,
    } = useDrawingCanvas({
      drawingMode,
      brushSize,
      brushColor,
      cropEnabled,
    });


    const onDrop = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) onPickFile(f);
      },
      [onPickFile]
    );

    const cssFilter = useMemo(() => buildCssFilter(filters), [filters]);

    const applyDrawing = () => {
      applyDrawingInternal(cssFilter, onApplyDrawing);
    };

    useImperativeHandle(ref, () => ({
      applyDrawing,
    }));

    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="
          relative
          h-[72vh]
          rounded-2xl
          border-2 border-dashed border-white/10
          bg-black/20
          overflow-auto
          nice-scrollbar
        "
      >
        {imageUrl ? (
          <div
            className={
              zoom <= 1
                ? "flex h-full items-center justify-center"
                : "block"
            }
          >
            <div
              className="
                relative
                mx-auto
                transition-all
                duration-300
                ease-out
              "
              style={{
                width: `${zoom * 100}%`,
                maxWidth: zoom <= 1 ? "100%" : undefined,
              }}
            >
              <img
                ref={imgRef}
                src={imageUrl}
                draggable={false}
                style={{ filter: cssFilter }}
                className={
                  "block w-full h-auto rounded-lg object-contain " +
                  (zoom <= 1 ? "max-h-[72vh]" : "")
                }
                onLoad={handleImageLoad}
              />

              {cropEnabled && (
                <CropOverlay rect={cropRect} onChange={onChangeCropRect} />
              )}

              <canvas
                ref={drawCanvasRef}
                className="absolute inset-0 rounded-lg"
                style={{
                  width: "100%",
                  height: "100%",
                  pointerEvents: drawingActive ? "auto" : "none",
                  cursor: drawingActive
                    ? drawingMode === "erase"
                      ? "cell"
                      : "crosshair"
                    : "default",
                }}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
              />
            </div>
          </div>
        ) : (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-slate-400">
            Przeciągnij obraz tutaj albo{" "}
            <button
              className="text-indigo-300 underline underline-offset-2"
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              wybierz z dysku
            </button>
          </div>
        )}

        {busy && (
          <div
            className="
              absolute inset-0
              backdrop-blur-sm
              bg-black/40
              flex items-center justify-center
              z-50
              animate-fadeIn
            "
          >
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPickFile(f);
          }}
        />
      </div>
    );
  }
);
