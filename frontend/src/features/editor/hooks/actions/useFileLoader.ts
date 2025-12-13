import { useCallback } from "react";
import { convertToEditorPng } from "@/features/editor/api/convertToEditorPng";

export function useFileLoader(
  setOriginalFormat: (v: string | null) => void,
  setError: (v: string | null) => void
) {
  const loadFileForEditor = useCallback(
    async (file: File): Promise<Blob | null> => {
      const ext = file.name.split(".").pop()?.toUpperCase() ?? null;
      setOriginalFormat(ext);

      try {
        return await convertToEditorPng(file);
      } catch {
        setError("Nieobsługiwany format pliku.");
        return null;
      }
    },
    [setOriginalFormat, setError]
  );

  return { loadFileForEditor };
}
