import axios from "@/shared/config/axios";

export async function removeBg(file: File): Promise<Blob> {
  const fd = new FormData();
  fd.append("file", file);

  const { data } = await axios.post("/edit/remove-bg", fd, {
    responseType: "blob",
  });

  return data as Blob;
}
