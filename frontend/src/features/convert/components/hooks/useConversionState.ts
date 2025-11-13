import { useEffect, useRef, useState } from "react";
import { convertZipCustom, type FileOption } from "@/features/convert/api";

type Fmt = string;

export function useConversionState() {
  const [files, setFiles] = useState<File[]>([]);
  const [formats, setFormats] = useState<Record<number, Fmt>>({});
  const [quality, setQuality] = useState<Record<number, number>>({});
  // NOWE: rozmiary per plik
  const [sizes, setSizes] = useState<Record<number, { width: number | null; height: number | null }>>({});

  const [busy, setBusy] = useState(false);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // inicjalizacja domyślnych wartości przy dodaniu plików
  useEffect(() => {
    setFormats((prev) => {
      const next = { ...prev };
      files.forEach((_, i) => {
        if (!next[i]) next[i] = "webp"; // domyślnie webp
      });
      return next;
    });
    setQuality((prev) => {
      const next = { ...prev };
      files.forEach((_, i) => {
        if (next[i] == null) next[i] = 85;
      });
      return next;
    });
    setSizes((prev) => {
      const next = { ...prev };
      files.forEach((_, i) => {
        if (!next[i]) next[i] = { width: null, height: null };
      });
      return next;
    });
  }, [files]);

  function addFiles(newFiles: File[]) {
    if (!newFiles.length) return;
    setFiles((p) => [...p, ...newFiles]);
  }

  function openAddDialog() {
    inputRef.current?.click();
  }

  function clearAll() {
    setFiles([]);
    setFormats({});
    setQuality({});
    setSizes({});
    setZipBlob(null);
  }

  function removeAt(i: number) {
    setFiles((p) => p.filter((_, idx) => idx !== i));

    const reindex = <T extends Record<number, any>>(obj: T) => {
      const copy = { ...obj };
      delete copy[i];
      const out: Record<number, any> = {};
      Object.keys(copy).forEach((k) => {
        const idx = Number(k);
        out[idx < i ? idx : idx - 1] = copy[idx];
      });
      return out as T;
    };
    setFormats((p) => reindex(p));
    setQuality((p) => reindex(p));
    setSizes((p) => reindex(p));
  }

  async function start() {
    if (!files.length) return;
    setBusy(true);
    try {
      const opts: FileOption[] = files.map((_, i) => {
        const fmt = (formats[i] ?? "webp").toLowerCase();
        const sz = sizes[i] ?? { width: null, height: null };
        return {
          format: fmt,
          width: sz.width,
          height: sz.height,
          quality: fmt === "png" ? null : (quality[i] ?? 85),
        };
      });
      setZipBlob(null);
      const blob = await convertZipCustom(files, opts);
      setZipBlob(blob);
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!zipBlob) return alert("Najpierw kliknij „Konwertuj wszystko”.");
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    files,
    setFiles,
    addFiles,
    openAddDialog,
    clearAll,
    removeAt,

    formats,
    setFormats,

    quality,
    setQuality,

    // rozmiary
    sizes,
    setSizes,

    busy,
    zipBlob,
    start,
    download,

    inputRef,
  };
}
