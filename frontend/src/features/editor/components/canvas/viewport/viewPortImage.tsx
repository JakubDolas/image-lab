import type { CropRect } from "@/features/editor/types";
import { CropOverlay } from "../crop/CropOverlay";

type Props = {
  imageUrl: string;
  cssFilter: string;
  imgRef: React.RefObject<HTMLImageElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  imgDim: { w: number; h: number } | null;
  scale: number;
  cropEnabled: boolean;
  cropRect: CropRect | null;
  onChangeCropRect: (rect: CropRect) => void;

  drawingActive: boolean;
  drawingMode: "off" | "draw" | "erase";

  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onPointerDown: React.MouseEventHandler<HTMLCanvasElement>;
  onPointerMove: React.MouseEventHandler<HTMLCanvasElement>;
  onPointerUp: React.MouseEventHandler<HTMLCanvasElement>;
};

export function ViewportImage({
  imageUrl,
  cssFilter,
  imgRef,
  canvasRef,
  imgDim,
  scale,
  cropEnabled,
  cropRect,
  onChangeCropRect,
  drawingActive,
  drawingMode,
  onImageLoad,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: Props) {
  return (
    <div
      className="relative transition-all duration-300 ease-out"
      style={{
        width: imgDim ? imgDim.w * scale : "auto",
        height: imgDim ? imgDim.h * scale : "auto",
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
        ref={canvasRef}
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
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
      />
    </div>
  );
}
