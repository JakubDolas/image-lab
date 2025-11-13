import axios from "@/shared/config/axios";

export type Filters = {
  brightness: number; contrast: number; saturate: number; hue: number; temperature: number;
};

export async function apiRemoveBg(fileOrBlob: Blob | File): Promise<Blob> {
  const fd = new FormData();
  fd.append("file", fileOrBlob, "image.png");
  const { data } = await axios.post("/edit/remove-bg", fd, { responseType: "blob" });
  return data as Blob;
}

export async function apiApplyFilters(fileOrBlob: Blob | File, f: Filters): Promise<Blob> {
  const fd = new FormData();
  fd.append("file", fileOrBlob, "image.png");
  fd.append("brightness", String(f.brightness));
  fd.append("contrast", String(f.contrast));
  fd.append("saturate", String(f.saturate));
  fd.append("hue", String(f.hue));
  fd.append("temperature", String(f.temperature));
  const { data } = await axios.post("/edit/apply-filters", fd, { responseType: "blob" });
  return data as Blob;
}

export async function apiExport(fileOrBlob: Blob | File, fmt: "png"|"jpeg"|"webp", quality = 90): Promise<Blob> {
  const fd = new FormData();
  fd.append("file", fileOrBlob, "image.png");
  fd.append("fmt", fmt);
  fd.append("quality", String(quality));
  const { data } = await axios.post("/edit/export", fd, { responseType: "blob" });
  return data as Blob;
}
