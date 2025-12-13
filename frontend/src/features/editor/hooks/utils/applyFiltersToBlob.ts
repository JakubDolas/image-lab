import { buildCssFilter, type Filters } from "@/features/editor/types";

export async function applyFiltersToBlob(
  blob: Blob,
  filters: Filters
): Promise<Blob> {
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.src = url;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    URL.revokeObjectURL(url);
    return blob;
  }

  ctx.filter = buildCssFilter(filters);
  ctx.drawImage(img, 0, 0);

  const mime =
    blob.type === "image/jpeg" || blob.type === "image/png"
      ? blob.type
      : "image/png";

  const out: Blob | null = await new Promise((res) =>
    canvas.toBlob((b) => res(b), mime)
  );

  URL.revokeObjectURL(url);
  return out ?? blob;
}
