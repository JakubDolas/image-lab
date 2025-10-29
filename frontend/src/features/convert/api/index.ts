import axios from "@/shared/config/axios";
import type { FileOption, SupportedFormatsResponse } from "../types";
export * from "../types";

export async function getSupportedFormats() {
  const { data } = await axios.get<SupportedFormatsResponse>("/convert/supported");
  return data;
}

export async function convertZipCustom(files: File[], options: FileOption[]) {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  form.append("options_json", JSON.stringify(options));
  const { data } = await axios.post<Blob>("/convert/zip-custom", form, {
    responseType: "blob",
  });
  return data;
}
