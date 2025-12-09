import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import {
  DEFAULT_FILTERS,
  type Filters,
  type CropRect,
  buildCssFilter,
} from "@/features/editor/types";
import { removeBg } from "@/features/editor/api/removeBg";
import { upscaleImage } from "@/features/editor/api/upscale";
import { downloadSingleImage } from "@/features/editor/api/download";

type Step = {
  blob: Blob;
  filters: Filters;
};

export type ImageSize = {
  width: number;
  height: number;
} | null;

async function applyFiltersToBlob(
  blob: Blob,
  filters: Filters
): Promise<Blob> {
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.src = url;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(e);
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    URL.revokeObjectURL(url);
    return blob;
  }

  ctx.filter = buildCssFilter(filters);
  ctx.drawImage(img, 0, 0);

  const mime =
    blob.type === "image/jpeg" || blob.type === "image/png"
      ? blob.type
      : "image/png";

  const outBlob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), mime)
  );

  URL.revokeObjectURL(url);
  return outBlob ?? blob;
}


export function useEditor() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);
  const [ptr, setPtr] = useState(-1);
  const current = steps[ptr] ?? null;

  const [busy, setBusy] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const [cropEnabled, setCropEnabled] = useState(false);
  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize>(null);

  type DrawingMode = "off" | "draw" | "erase";
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("off");
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#ff0000");

  const [historyItems, setHistoryItems] = useState<string[]>([]);

  const [colorSpace, setColorSpace] = useState<string>("RGB");

  const addHistory = useCallback(
    (label: string, dedupeLast: boolean = false) => {
      setHistoryItems((prev) => {
        const base = prev.slice(0, ptr + 1);

        if (dedupeLast && base[base.length - 1] === label) {
          return base;
        }

        return [...base, label];
      });
    },
    [ptr]
  );

  const imageUrl = useMemo(
    () => (current ? URL.createObjectURL(current.blob) : null),
    [current]
  );

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
    const filtersChanged = JSON.stringify(current.filters) !== JSON.stringify(filters);

    if (filtersChanged) {
      setSteps((prev) => [
        ...prev.slice(0, ptr + 1),
        { blob: current.blob, filters: { ...filters } },
      ]);
      setPtr((p) => p + 1);
      addHistory("Zmieniono kolor ustawienia kolorów/efektów", true)
    }
  }, [current, filters, ptr, addHistory]);

  useEffect(() => {
    if (current) {
      setFilters(current.filters);
    }
  }, [current]);

  const onPickFile = useCallback(
    (file: File) => {
      pushStep(file, DEFAULT_FILTERS);
      setCropEnabled(false);
      setCropRect(null);

      setHistoryItems([])
      addHistory("Załadowano obraz")
    },
    [pushStep, addHistory]
  );

  const onUndo = () => {
    if (ptr <= 0) return;
    setPtr((p) => Math.max(0, p - 1));
  };

  const onRedo = () => {
    if (ptr >= steps.length - 1) return;
    setPtr((p) => Math.min(steps.length - 1, p + 1));
  };

  const pickOther = () => inputRef.current?.click();

  const onRemoveBg = async () => {
    if (!current) return;
    setBusy(true);
    try {
      const blobWithFilters = await applyFiltersToBlob(current.blob, filters);
      
      const resultBlob = await removeBg(blobWithFilters);
      
      pushStep(resultBlob, DEFAULT_FILTERS);
      addHistory("Usunięto tło")
    } finally {
      setBusy(false);
    }
  };

  const onUpscale = async () => {
    if (!current) return;
    setBusy(true);
    try {
      const blobWithFilters = await applyFiltersToBlob(current.blob, filters);

      const resultBlob = await upscaleImage(blobWithFilters);

      pushStep(resultBlob, DEFAULT_FILTERS);
      addHistory("Powiększono obraz (upscale)")
    } finally {
      setBusy(false);
    }
  };

  const handleStartCrop = () => {
    if (!current) return;
    setCropEnabled(true);
    if (!cropRect) {
      setCropRect({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
    }
  };

  const handleCancelCrop = () => {
    setCropEnabled(false);
  };

  const handleApplyCrop = async () => {
    if (!current || !cropRect) return;
    setBusy(true);
    const url = URL.createObjectURL(current.blob);
    try {
      const img = new Image();
      img.src = url;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
      });

      const sx = Math.round(cropRect.x * img.naturalWidth);
      const sy = Math.round(cropRect.y * img.naturalHeight);
      const sw = Math.round(cropRect.width * img.naturalWidth);
      const sh = Math.round(cropRect.height * img.naturalHeight);

      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.filter = buildCssFilter(filters);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png")
      );
      if (blob) {
        pushStep(blob, DEFAULT_FILTERS);
        addHistory("Przycięto obraz")
      }
    } finally {
      setBusy(false);
      setCropEnabled(false);
      URL.revokeObjectURL(url);
    }
  };

  const onDownload = async (format: string, quality: number) => {
    if (!current) return;
    setBusy(true);
    try {
      const filteredBlob = await applyFiltersToBlob(current.blob, filters);
      const zipBlob = await downloadSingleImage(filteredBlob, format, quality);

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image_${format}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      addHistory(`Pobrano obraz (${format.toUpperCase()}, ${quality}%)`);
    } finally {
      setBusy(false);
    }
  };

  const detectColorSpace = async (blob: Blob): Promise<string> => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      return "RGB";
    }

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let isGrayscale = true;

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];

      if (r !== g || g !== b) {
        isGrayscale = false;
        break;
      }
    }

    URL.revokeObjectURL(url);

    if (isGrayscale) return "Grayscale";

    if (blob.type === "image/jpeg" || blob.type === "image/jpg") {
      return "RGB / CMYK?";
    }

    return "RGB";
  };

  const updateImageSize = useCallback(async (blob: Blob) => {
    try {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
      });

      setImageSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });

      URL.revokeObjectURL(url);
    } catch {
      setImageSize(null);
    }
  }, []);

  useEffect(() => {
    if (!current) {
      setImageSize(null);
      setColorSpace("RGB");
      return;
    }

    updateImageSize(current.blob);

    detectColorSpace(current.blob).then(setColorSpace);
  }, [current, updateImageSize]);

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
      colorSpace
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
        addHistory("Zastosowano rysowanie po obrazie")
      },
    },
  };
}