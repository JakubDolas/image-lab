import { applyFiltersToBlob } from "@/features/editor/hooks/utils/applyFiltersToBlob";
import { removeBg } from "@/features/editor/api/removeBg";
import { upscaleImage } from "@/features/editor/api/upscale";
import { DEFAULT_FILTERS } from "@/features/editor/types";

export function useImageAI(
  current: any,
  filters: any,
  pushStep: (b: Blob, f?: any) => void,
  addHistory: (s: string) => void,
  setBusy: (v: boolean) => void
) {
  const onRemoveBg = async () => {
    if (!current) return;
    setBusy(true);
    try {
      const b = await applyFiltersToBlob(current.blob, filters);
      const out = await removeBg(b);
      pushStep(out, DEFAULT_FILTERS);
      addHistory("Usunięto tło");
    } finally {
      setBusy(false);
    }
  };

  const onUpscale = async () => {
    if (!current) return;
    setBusy(true);
    try {
      const b = await applyFiltersToBlob(current.blob, filters);
      const out = await upscaleImage(b);
      pushStep(out, DEFAULT_FILTERS);
      addHistory("Powiększono obraz");
    } finally {
      setBusy(false);
    }
  };

  return { onRemoveBg, onUpscale };
}
