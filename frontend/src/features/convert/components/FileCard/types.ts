export type Fmt = string;

export type FileOption = {
  width: number | null;
  height: number | null;
  quality: number | null;
  format: Fmt;
};

export type SupportedFormatsResponse = {
  formats: string[];
  preferred_ext: Record<string, string>;
};
