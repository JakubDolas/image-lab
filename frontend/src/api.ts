import axios from "axios";
export const API_URL = "http://localhost:8000";

export async function convertZipSimple(files: File[], targetFormat: string) {
  const form = new FormData();
  for (const f of files) form.append("files", f);
  const url = `${API_URL}/convert/zip-simple?target_format=${encodeURIComponent(targetFormat)}`;
  const res = await axios.post(url, form, { responseType: "blob" });
  return res.data;
}
