import type { MouseEvent as ReactMouseEvent } from "react";
import type { DrawingMode } from "./drawing.types";
import type { Point } from "./drawing.types";



export function getPos(
  e: ReactMouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width || 1;
  const scaleY = canvas.height / rect.height || 1;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}


type HandlersConfig = {
  drawingMode: DrawingMode;
  brushSize: number;
  brushColor: string;
  cropEnabled: boolean;

  imageReady: boolean;
  isDrawingRef: React.RefObject<boolean>;
  lastPointRef: React.RefObject<Point | null>;
  hasDrawnRef: React.RefObject<boolean>;

  drawCanvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export function createDrawingHandlers(cfg: HandlersConfig) {
  const handlePointerDown = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!cfg.imageReady) return;
    if (cfg.drawingMode === "off" || cfg.cropEnabled) return;

    const canvas = cfg.drawCanvasRef.current;
    if (!canvas) return;

    cfg.isDrawingRef.current = true;
    cfg.lastPointRef.current = getPos(e, canvas);
  };

  const handlePointerMove = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!cfg.isDrawingRef.current) return;

    const canvas = cfg.drawCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const p = getPos(e, canvas);
    const last = cfg.lastPointRef.current ?? p;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = cfg.brushSize;

    if (cfg.drawingMode === "erase") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = cfg.brushColor;
    }

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    cfg.hasDrawnRef.current = true;
    cfg.lastPointRef.current = p;
  };

  const handlePointerUp = () => {
    cfg.isDrawingRef.current = false;
    cfg.lastPointRef.current = null;
  };

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
