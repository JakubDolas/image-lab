import type { Filters, CropRect } from "@/features/editor/types";

export type DrawingMode = "off" | "draw" | "erase";

export type CanvasViewportProps = {
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
