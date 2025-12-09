import {
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
  useState,
  type DragEvent,
  type SyntheticEvent,
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
  cancelDrawing: () => void;
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
    },
    ref
  ) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [imgDim, setImgDim] = useState<{ w: number; h: number } | null>(null);
    const [baseScale, setBaseScale] = useState(1);

    const {
      imgRef,
      drawCanvasRef,
      drawingActive,
      handleImageLoad: handleImageLoadInternal,
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
      applyDrawing: applyDrawingInternal,
      clearDrawing,
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

    const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
      const el = e.currentTarget;
      const natW = el.naturalWidth;
      const natH = el.naturalHeight;

      setImgDim({ w: natW, h: natH });

      if (containerRef.current && natW > 0 && natH > 0) {
        const cw = containerRef.current.clientWidth;
        const ch = containerRef.current.clientHeight;

        if (cw > 0 && ch > 0) {
          const scaleToFit = Math.min(cw / natW, ch / natH);

          setBaseScale(scaleToFit < 1 ? scaleToFit : 1);
        } else {
          setBaseScale(1);
        }
      } else {
        setBaseScale(1);
      }

      handleImageLoadInternal();
    };

    const cssFilter = useMemo(() => buildCssFilter(filters), [filters]);

    const applyDrawing = () => {
      applyDrawingInternal(cssFilter, onApplyDrawing);
    };

    const cancelDrawing = () => {
      clearDrawing();
    };

    useImperativeHandle(ref, () => ({
      applyDrawing,
      cancelDrawing,
    }));

    const effectiveScale = baseScale * zoom;

    return (
      <div
        ref={containerRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
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
          <div
            className="relative transition-all duration-300 ease-out"
            style={{
              width: imgDim ? imgDim.w * effectiveScale : "auto",
              height: imgDim ? imgDim.h * effectiveScale : "auto",
              opacity: imgDim ? 1 : 0,
            }}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              draggable={false}
              alt="Edytowany obraz"
              style={{ filter: cssFilter }}
              className="block w-full h-full object-contain shadow-2xl rounded-lg"
              onLoad={onImageLoad}
            />

            {cropEnabled && (
              <CropOverlay rect={cropRect} onChange={onChangeCropRect} />
            )}

            <canvas
              ref={drawCanvasRef}
              className="absolute inset-0 rounded-lg touch-none"
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
        ) : (
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-2">
              Przeciągnij obraz tutaj albo
            </div>
            <button
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 font-medium transition-colors"
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
            e.currentTarget.value = "";
          }}
        />
      </div>
    );
  }
);
