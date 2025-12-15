import { useRef, useState } from "react";
import { convertToEditorPng } from "@/features/editor/api/convertToEditorPng";
import { BROWSER_IMAGE_MIMES } from "@/features/convert/components/lib/imageSupport";

type FileEntry = {
  file: File;
  previewBlob: File | Blob;
  originalFormat: string;
};

export function useConversionFiles() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  function openAddDialog() {
    inputRef.current?.click();
  }

  async function addFiles(newFiles: File[]) {
    if (!newFiles.length) return;

    const entries: FileEntry[] = [];

    for (const f of newFiles) {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "unknown";
      let previewBlob: File | Blob = f;

      if (!BROWSER_IMAGE_MIMES.has(f.type)) {
        try {
          previewBlob = await convertToEditorPng(f);
        } catch {
          setError(`Nieobsługiwany format: ${ext.toUpperCase()}`);
          continue;
        }
      }

      entries.push({
        file: f,
        previewBlob,
        originalFormat: ext,
      });
    }

    if (entries.length) {
      setFiles((p) => [...p, ...entries]);
    }
  }

  function removeAt(i: number) {
    setFiles((p) => p.filter((_, idx) => idx !== i));
  }

  function clearAll() {
    setFiles([]);
    setError(null);
  }

  return {
    files,
    setFiles,
    addFiles,
    removeAt,
    clearAll,

    inputRef,
    openAddDialog,

    error,
    setError,
  };
}
