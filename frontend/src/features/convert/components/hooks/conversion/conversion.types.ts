export type FileEntry = {
  file: File;
  previewBlob: File | Blob;
  originalFormat: string;
};

export type ResizeSize = {
  width: number | null;
  height: number | null;
};
