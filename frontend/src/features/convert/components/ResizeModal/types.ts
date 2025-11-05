export type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export type ResizeModalProps = {
  file: File;
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

export type Props = {
  nat: { w: number; h: number } | null;
  w: number;
  h: number;
  keepAspect: boolean;
  setKeepAspect: (v: boolean) => void;
  limitToOrig: boolean;
  setLimitToOrig: (v: boolean) => void;
  onChangeW: (val: number) => void;
  onChangeH: (val: number) => void;
  onPickSize: (w: number, h: number) => void;
  onApply: () => void;
  onClose: () => void;
};