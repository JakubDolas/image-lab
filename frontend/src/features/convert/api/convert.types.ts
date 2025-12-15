export type FileOption = {
  format: string;
  quality?: number;
  width?: number | null;
  height?: number | null;
};

export type SupportedFormatsResponse = {
  formats: string[];
  preferred_ext?: Record<string, string>;
};
