import { useCallback } from "react";
import { DEFAULT_FILTERS } from "@/features/editor/types";

export function usePickFile(
  loadFileForEditor: (file: File) => Promise<Blob | null>,
  pushStep: (blob: Blob, filters?: any) => void,
  setCropEnabled: (v: boolean) => void,
  setCropRect: (v: any) => void,
  setHistoryItems: (v: string[]) => void,
  addHistory: (label: string) => void,
  setError: (v: string | null) => void
) {
  const onPickFile = useCallback(
    async (file: File) => {
      try {
        const blob = await loadFileForEditor(file);
        if (!blob) return;

        pushStep(blob, DEFAULT_FILTERS);
        setCropEnabled(false);
        setCropRect(null);
        setHistoryItems([]);
        addHistory("Załadowano obraz");
      } catch {
        setError("Nie udało się wczytać pliku.");
      }
    },
    [
      loadFileForEditor,
      pushStep,
      setCropEnabled,
      setCropRect,
      setHistoryItems,
      addHistory,
      setError,
    ]
  );

  return { onPickFile };
}
