export type ResizeSize = {
  width: number | null;
  height: number | null;
};

export type FileCardProps = {
  file: File;
  previewBlob: File | Blob;
  index: number;

  currentFormat: string;
  onPickFormat: (fmt: string) => void;

  quality: number;
  onQuality: (v: number) => void;

  onRemove: (index: number) => void;

  availableFormats: string[];
  labelMap: Record<string, string>;

  size?: ResizeSize;
  onSizeChange?: (size: ResizeSize) => void;
};
