import axios from "axios";

export async function downloadSingleImage(
  file: Blob,
  format: string,
  quality: number | null
): Promise<Blob> {
  const formData = new FormData();
  formData.append("files", file, "image.png");

  return axios.post(
    `/convert/zip-simple?target_format=${encodeURIComponent(format)}&quality=${quality ?? ""}`,
    formData,
    { responseType: "blob" }
  ).then(res => res.data);
}
