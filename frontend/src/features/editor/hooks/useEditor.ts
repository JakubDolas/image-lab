import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { DEFAULT_FILTERS, type Filters, type CropRect } from "@/features/editor/types";

import type { Step, DrawingMode } from "./types/editorTypes";

import { useFileLoader } from "./actions/useFileLoader";
import { usePickFile } from "./actions/usePickFile";
import { useImageAI } from "./actions/useImageAI";
import { useCrop } from "./actions/useCrop";
import { useExport } from "./actions/useExport";

import { useHistory } from "./state/useHistory";
import { useUndoRedo } from "./state/useUndoRedo";
import { useImageMetadata } from "./state/useImageMetadata";

export function useEditor() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);
  const [ptr, setPtr] = useState(-1);
  const current = steps[ptr] ?? null;

  useEffect(() => {
    if (current) {
      setFilters(current.filters);
    }
  }, [current]);

  const [busy, setBusy] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const [cropEnabled, setCropEnabled] = useState(false);
  const [cropRect, setCropRect] = useState<CropRect | null>(null);

  const [drawingMode, setDrawingMode] = useState<DrawingMode>("off");
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#ff0000");

  const [originalFormat, setOriginalFormat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { historyItems, setHistoryItems, addHistory } = useHistory(ptr);

  const pushStep = useCallback(
    (blob: Blob, newFilters: Filters = DEFAULT_FILTERS) => {
      setSteps((prev) => [
        ...prev.slice(0, ptr + 1),
        { blob, filters: newFilters },
      ]);
      setPtr((p) => p + 1);
      setFilters(newFilters);
    },
    [ptr]
  );

  const saveFilterState = useCallback(() => {
    if (!current) return;
    const changed =
      JSON.stringify(current.filters) !== JSON.stringify(filters);

    if (changed) {
      setSteps((prev) => [
        ...prev.slice(0, ptr + 1),
        { blob: current.blob, filters: { ...filters } },
      ]);
      setPtr((p) => p + 1);
      addHistory("Zmieniono ustawienia kolorów/efektów", true);
    }
  }, [current, filters, ptr, addHistory]);

  const { loadFileForEditor } = useFileLoader(setOriginalFormat, setError);

  const { onPickFile } = usePickFile(
    loadFileForEditor,
    pushStep,
    setCropEnabled,
    setCropRect,
    setHistoryItems,
    addHistory,
    setError
  );

  const { onUndo, onRedo } = useUndoRedo(ptr, setPtr, steps.length);

  const pickOther = () => inputRef.current?.click();

  const { onRemoveBg, onUpscale } = useImageAI(
    current,
    filters,
    pushStep,
    addHistory,
    setBusy
  );

  const {
    handleStartCrop,
    handleCancelCrop,
    handleApplyCrop,
  } = useCrop(
    current,
    filters,
    cropRect,
    setCropRect,
    setCropEnabled,
    pushStep,
    addHistory,
    setBusy
  );

  const { onDownload } = useExport(
    current,
    filters,
    setBusy,
    addHistory
  );

  const { imageSize, colorSpace } = useImageMetadata(current);

  const imageUrl = useMemo(
    () => (current ? URL.createObjectURL(current.blob) : null),
    [current]
  );

  const visibleHistoryItems = historyItems.slice(0, ptr + 1);


  return {
    ref: { inputRef },

    state: {
      current,
      imageUrl,
      busy,
      filters,
      cropEnabled,
      cropRect,
      canUndo: ptr > 0,
      canRedo: ptr < steps.length - 1,
      imageSize,
      drawingMode,
      brushSize,
      brushColor,
      historyItems: visibleHistoryItems,
      colorSpace,
      originalFormat,
      error,
    },

    actions: {
      setFilters,

      resetFilters: () => {
        if (!current) return;
        pushStep(current.blob, DEFAULT_FILTERS);
        addHistory("Zresetowano filtry");
      },

      saveFilterState,

      onPickFile,
      onUndo,
      onRedo,
      pickOther,

      onRemoveBg,
      onUpscale,

      handleStartCrop,
      handleCancelCrop,
      handleApplyCrop,

      onDownload,

      setCropRect,
      setDrawingMode,
      setBrushSize,
      setBrushColor,

      onApplyDrawing: (blob: Blob) => {
        pushStep(blob, DEFAULT_FILTERS);
        addHistory("Zastosowano rysowanie po obrazie");
      },

      setError,
    },
  };
}
