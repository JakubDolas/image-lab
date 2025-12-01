const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function upscaleImage(blob: Blob): Promise<Blob> {
  const form = new FormData();
  form.append("file", blob, "image.png");

  const res = await fetch(`${API_BASE}/edit/upscale`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error("Upscaling failed");
  }

  return await res.blob();
}
