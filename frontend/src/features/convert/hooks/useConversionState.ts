import { useEffect, useRef, useState } from "react";
import { convertZipCustom } from "../api";
import type { FileOption, Fmt } from "../types";

export function useConversionState() {
  const [files, setFiles] = useState<File[]>([]);
  const [formats, setFormats] = useState<Record<number, Fmt>>({});
  const [quality, setQuality] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFormats((prev) => {
      const copy = { ...prev };
      files.forEach((_, i) => { if (!copy[i]) copy[i] = "webp"; });
      return copy;
    });
    setQuality((prev) => {
      const copy = { ...prev };
      files.forEach((_, i) => { if (copy[i] == null) copy[i] = 85; });
      return copy;
    });
  }, [files]);

  function openAddDialog() { inputRef.current?.click(); }
  function addFiles(list: File[]) { if (list.length) setFiles((p) => [...p, ...list]); }
  function clearAll() { setFiles([]); setFormats({}); setQuality({}); setZipBlob(null); }

  function removeAt(idx: number) {
    setFiles((p) => p.filter((_, i) => i !== idx));
    setFormats((p) => {
      const c = { ...p }; delete c[idx];
      const s: Record<number, Fmt> = {};
      Object.keys(c).forEach((k) => { const i = +k; s[i < idx ? i : i - 1] = c[i]; });
      return s;
    });
    setQuality((p) => {
      const c = { ...p }; delete c[idx];
      const s: Record<number, number> = {};
      Object.keys(c).forEach((k) => { const i = +k; s[i < idx ? i : i - 1] = c[i]; });
      return s;
    });
  }

  async function start() {
    if (!files.length) return;
    setBusy(true);
    try {
      const opts: FileOption[] = files.map((_, i) => {
        const fmt = (formats[i] ?? "webp").toLowerCase();
        const lossy = fmt === "jpeg" || fmt === "webp";
        return { width: null, height: null, format: fmt, quality: lossy ? (quality[i] ?? 85) : null };
      });
      setZipBlob(null);
      const blob = await convertZipCustom(files, opts);
      setZipBlob(blob);
    } finally { setBusy(false); }
  }

  function download() {
    if (!zipBlob) return;
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url; a.download = "converted.zip"; a.click();
    URL.revokeObjectURL(url);
  }

  return {
    files, setFiles, formats, setFormats, quality, setQuality,
    busy, zipBlob, inputRef,
    openAddDialog, addFiles, clearAll, removeAt, start, download,
  };
}
