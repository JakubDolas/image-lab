import axios from "@/shared/config/axios";

export async function removeBg(input: File | Blob | string): Promise<Blob> {
  let payload: Blob;

  if (typeof input === "string") {
    const res = await fetch(input);
    payload = await res.blob();
  } else {
    payload = input;
  }

  const fd = new FormData();
  fd.append("file", payload, "image.png");

  const { data } = await axios.post("/edit/remove-bg", fd, {
    responseType: "blob",
  });

  return data as Blob;
}
