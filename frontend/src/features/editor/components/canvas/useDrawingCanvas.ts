import {
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

type DrawingMode = "off" | "draw" | "erase";

type Config = {
  drawingMode: DrawingMode;
  brushSize: number;
  brushColor: string;
  cropEnabled: boolean;
};

export function useDrawingCanvas({
  drawingMode,
  brushSize,
  brushColor,
  cropEnabled,
}: Config) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hasDrawnRef = useRef(false);

  const [imageReady, setImageReady] = useState(false);

  const handleImageLoad = () => {
    const img = imgRef.current;
    const canvas = drawCanvasRef.current;
    if (!img || !canvas) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setImageReady(true);
    hasDrawnRef.current = false;
  };

  const getPos = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width || 1;
    const scaleY = canvas.height / rect.height || 1;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!imageReady) return;
    if (drawingMode === "off" || cropEnabled) return;

    isDrawingRef.current = true;
    lastPointRef.current = getPos(e);
  };

  const handlePointerMove = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    const canvas = drawCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const p = getPos(e);
    const last = lastPointRef.current ?? p;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;

    if (drawingMode === "erase") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
    }

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    hasDrawnRef.current = true;
    lastPointRef.current = p;
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const applyDrawing = (
    cssFilter: string,
    onApplyDrawing: (blob: Blob) => void
  ) => {
    if (!hasDrawnRef.current) return;

    const img = imgRef.current;
    const overlay = drawCanvasRef.current;
    if (!img || !overlay) return;
    if (!overlay.width || !overlay.height) return;

    const w = overlay.width;
    const h = overlay.height;

    const merged = document.createElement("canvas");
    merged.width = w;
    merged.height = h;
    const ctx = merged.getContext("2d");
    if (!ctx) return;

    ctx.filter = cssFilter;
    ctx.drawImage(img, 0, 0, w, h);

    ctx.filter = "none";
    ctx.drawImage(overlay, 0, 0, w, h);

    merged.toBlob((blob) => {
      if (!blob) return;

      onApplyDrawing(blob);

      const octx = overlay.getContext("2d");
      if (octx) {
        octx.clearRect(0, 0, overlay.width, overlay.height);
      }
      hasDrawnRef.current = false;
    }, "image/png");
  };

  const clearDrawing = () => {
    const overlay = drawCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    hasDrawnRef.current = false;
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };


  const drawingActive =
    drawingMode !== "off" && !cropEnabled && imageReady;

  return {
    imgRef,
    drawCanvasRef,
    drawingActive,
    handleImageLoad,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    applyDrawing,
    clearDrawing,
  };
}
