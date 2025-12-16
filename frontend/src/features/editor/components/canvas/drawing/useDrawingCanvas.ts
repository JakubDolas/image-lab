import { useMemo } from "react";
import type { DrawingConfig } from "./drawing.types";
import { useDrawingState } from "./useDrawingState";
import { createDrawingHandlers } from "./drawing.handlers";
import {
  applyDrawingOperation,
  clearDrawingOperation,
} from "./drawing.operations";

export function useDrawingCanvas(cfg: DrawingConfig) {
  const state = useDrawingState();

  const handleImageLoad = () => {
    const img = state.imgRef.current;
    const canvas = state.drawCanvasRef.current;
    if (!img || !canvas) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    state.setImageReady(true);
    state.hasDrawnRef.current = false;
  };

  const handlers = useMemo(
    () =>
      createDrawingHandlers({
        ...cfg,
        imageReady: state.imageReady,
        isDrawingRef: state.isDrawingRef,
        lastPointRef: state.lastPointRef,
        hasDrawnRef: state.hasDrawnRef,
        drawCanvasRef: state.drawCanvasRef,
      }),
    [
      cfg.drawingMode,
      cfg.brushSize,
      cfg.brushColor,
      cfg.cropEnabled,
      state.imageReady,
    ]
  );

  const applyDrawing = (
    cssFilter: string,
    onApplyDrawing: (blob: Blob) => void
  ) => {
    const img = state.imgRef.current;
    const overlay = state.drawCanvasRef.current;
    if (!img || !overlay) return;

    applyDrawingOperation(
      img,
      overlay,
      cssFilter,
      onApplyDrawing,
      state.hasDrawnRef
    );
  };

  const clearDrawing = () => {
    const overlay = state.drawCanvasRef.current;
    if (!overlay) return;

    clearDrawingOperation(
      overlay,
      state.hasDrawnRef,
      state.isDrawingRef,
      state.lastPointRef
    );
  };

  const drawingActive =
    cfg.drawingMode !== "off" &&
    !cfg.cropEnabled &&
    state.imageReady;

  return {
    imgRef: state.imgRef,
    drawCanvasRef: state.drawCanvasRef,
    drawingActive,
    handleImageLoad,
    ...handlers,
    applyDrawing,
    clearDrawing,
  };
}
