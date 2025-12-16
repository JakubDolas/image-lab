import type { Filters, CropRect } from "@/features/editor/types";

export type CanvasProps = {
  imageUrl: string | null;
  onPickFile: (file: File) => void;
  filters: Filters;
  cropEnabled: boolean;
  cropRect: CropRect | null;
  onChangeCropRect: (rect: CropRect) => void;
  busy: boolean;

  drawingMode: "off" | "draw" | "erase";
  brushSize: number;
  brushColor: string;
  onApplyDrawing: (blob: Blob) => void;
};

export type CanvasHandle = {
  applyDrawing: () => void;
  cancelDrawing: () => void;
};
