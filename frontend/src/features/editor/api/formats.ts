import axios from "axios";

export type SupportedFormatsResponse = {
  formats: string[];
  preferred_ext: Record<string, string>;
};

export async function getEditorSupportedFormats() {
  const { data } = await axios.get<SupportedFormatsResponse>("/convert/supported");
  return data;
}
