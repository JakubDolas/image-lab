export type NativeSize = { w: number; h: number } | null;

export type ControlsPanelProps = {
  nat: NativeSize;

  w: number | null;
  h: number | null;

  keepAspect: boolean;
  setKeepAspect: (v: boolean) => void;

  limitToOrig: boolean;
  setLimitToOrig: (v: boolean) => void;

  onChangeW: (v: number) => void;
  onChangeH: (v: number) => void;
  onPickSize: (w: number, h: number) => void;

  onApply: () => void;
  onClose: () => void;
};
