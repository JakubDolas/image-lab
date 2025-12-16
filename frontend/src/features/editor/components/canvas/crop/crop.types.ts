import type { CropRect } from "@/features/editor/types";

export type OverlayProps = {
  rect: CropRect | null;
  onChange: (rect: CropRect) => void;
};

export type DragKind = "move" | "nw" | "ne" | "sw" | "se";

export type DragState = {
  kind: DragKind;
  startX: number;
  startY: number;
  startRect: CropRect;
  boxWidth: number;
  boxHeight: number;
};
