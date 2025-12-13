import axios from "axios";

export type SupportedFormatsResponse = {
  formats: string[];
  preferred_ext: Record<string, string>;
};

export const BLOCKED_FORMATS = [
  "blp",
  "bufr",
  "grib",
  "hdf5",
  "palm",
  "msp",
  "sgi",
  "pcx",
  "xbm",
  "wmf",
];

export async function getEditorSupportedFormats() {
  const { data } = await axios.get<SupportedFormatsResponse>("/convert/supported");

  return {
    ...data,
    formats: data.formats.filter(f => !BLOCKED_FORMATS.includes(f.toLowerCase())),
  };
}
