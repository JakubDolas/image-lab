import { buildCssFilter, DEFAULT_FILTERS } from "@/features/editor/types";

export function useCrop(
  current: any,
  filters: any,
  cropRect: any,
  setCropRect: (v: any) => void,
  setCropEnabled: (v: boolean) => void,
  pushStep: (b: Blob, f?: any) => void,
  addHistory: (s: string) => void,
  setBusy: (v: boolean) => void
) {
  const handleStartCrop = () => {
    if (!current) return;
    setCropEnabled(true);
    if (!cropRect)
      setCropRect({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
  };

  const handleCancelCrop = () => setCropEnabled(false);

  const handleApplyCrop = async () => {
    if (!current || !cropRect) return;
    setBusy(true);

    const url = URL.createObjectURL(current.blob);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();

      const sx = cropRect.x * img.naturalWidth;
      const sy = cropRect.y * img.naturalHeight;
      const sw = cropRect.width * img.naturalWidth;
      const sh = cropRect.height * img.naturalHeight;

      const c = document.createElement("canvas");
      c.width = sw;
      c.height = sh;
      const ctx = c.getContext("2d")!;
      ctx.filter = buildCssFilter(filters);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

      const blob = await new Promise<Blob | null>((r) =>
        c.toBlob((b) => r(b), "image/png")
      );

      if (blob) {
        pushStep(blob, DEFAULT_FILTERS);
        addHistory("Przycięto obraz");
      }
    } finally {
      URL.revokeObjectURL(url);
      setCropEnabled(false);
      setBusy(false);
    }
  };

  return { handleStartCrop, handleCancelCrop, handleApplyCrop };
}
