import { useState } from "react";
import { convertZipCustom, type FileOption } from "@/features/convert/api";
import type { FileEntry, ResizeSize } from "./conversion.types";

export function useZipConversion(
  files: FileEntry[],
  formats: Record<number, string>,
  quality: Record<number, number>,
  sizes: Record<number, ResizeSize>,
  setError: (e: string | null) => void
) {
  const [busy, setBusy] = useState(false);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  async function start() {
    if (!files.length) return;
    setBusy(true);
    setError(null);

    try {
      const options: FileOption[] = files.map((_, i) => {
        const fmt = (formats[i] ?? "webp").toLowerCase();
        const sz = sizes[i];
        return {
          format: fmt,
          width: sz?.width ?? null,
          height: sz?.height ?? null,
          quality: fmt === "png" ? undefined : (quality[i] ?? 85),
        };
      });

      const blob = await convertZipCustom(
        files.map((f) => f.file),
        options
      );

      setZipBlob(blob);
    } catch {
      setError("Wystąpił błąd podczas konwersji.");
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!zipBlob) return;
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  return { busy, zipBlob, start, download };
}
