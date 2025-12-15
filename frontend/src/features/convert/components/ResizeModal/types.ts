export type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export type ResizeModalProps = {
  file: Blob | File;
  initialWidth?: number | null;
  initialHeight?: number | null;
  keepAspectDefault?: boolean;
  limitToOriginalDefault?: boolean;
  onApply: (size: { width: number; height: number }) => void;
  onClose: () => void;
};

export type PreviewState = {
  s: number;     // skala podglądu
  pw: number;    // szer. wyświetlana
  ph: number;    // wys. wyświetlana
  dw: number;    // szer. docelowa (px)
  dh: number;    // wys. docelowa (px)
};
