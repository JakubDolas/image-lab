export type DrawingMode = "off" | "draw" | "erase";

export type DrawingConfig = {
  drawingMode: DrawingMode;
  brushSize: number;
  brushColor: string;
  cropEnabled: boolean;
};

export type Point = {
  x: number;
  y: number;
};
