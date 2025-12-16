import { useRef, useState } from "react";
import type { Point } from "./drawing.types";

export function useDrawingState() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const hasDrawnRef = useRef(false);

  const [imageReady, setImageReady] = useState(false);

  return {
    imgRef,
    drawCanvasRef,
    isDrawingRef,
    lastPointRef,
    hasDrawnRef,
    imageReady,
    setImageReady,
  };
}
