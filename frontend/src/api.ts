import axios from "axios";

export const API_URL = "http://localhost:8000";

export type FileOption = {
  width: number | null;
  height: number | null;
  quality: number | null;
  format: "jpg" | "png" | "webp";
};

export async function convertZipSimple(files: File[], targetFormat: string) {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const url = `${API_URL}/convert/zip-simple?target_format=${encodeURIComponent(
    targetFormat
  )}`;
  const res = await axios.post(url, form, { responseType: "blob" });
  return res.data as Blob;
}

export async function convertZipCustom(
  files: File[],
  options: FileOption[],
) {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  form.append("options_json", JSON.stringify(options));
  const url = `${API_URL}/convert/zip-custom`;
  const res = await axios.post(url, form, { responseType: "blob" });
  return res.data as Blob;
}