import { applyFiltersToBlob } from "@/features/editor/hooks/utils/applyFiltersToBlob";
import { downloadSingleImage } from "@/features/editor/api/download";

export function useExport(
  current: any,
  filters: any,
  setBusy: (v: boolean) => void,
  addHistory: (s: string) => void
) {
  const onDownload = async (format: string, quality: number) => {
    if (!current) return;
    setBusy(true);
    try {
      const b = await applyFiltersToBlob(current.blob, filters);
      const zip = await downloadSingleImage(b, format, quality);

      const url = URL.createObjectURL(zip);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image_${format}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      addHistory(`Pobrano obraz (${format.toUpperCase()})`);
    } finally {
      setBusy(false);
    }
  };

  return { onDownload };
}
