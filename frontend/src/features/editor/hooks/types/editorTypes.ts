import type { Filters } from "@/features/editor/types";

export type Step = {
  blob: Blob;
  filters: Filters;
};

export type ImageSize = {
  width: number;
  height: number;
} | null;

export type DrawingMode = "off" | "draw" | "erase";
