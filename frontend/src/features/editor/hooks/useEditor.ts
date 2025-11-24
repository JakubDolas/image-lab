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
};

export type ImageSize = {
  width: number;
  height: number;
} | null;

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

  const imageUrl = useMemo(
    () => (current ? URL.createObjectURL(current.blob) : null),
    [current]
  );

  const pushStep = useCallback(
    (blob: Blob) => {
      setSteps((prev) => [...prev.slice(0, ptr + 1), { blob }]);
      setPtr((p) => p + 1);
    },
    [ptr]
  );

  const onPickFile = useCallback(
    (file: File) => {
      pushStep(file);
      setFilters(DEFAULT_FILTERS);
      setCropEnabled(false);
      setCropRect(null);
    },
    [pushStep]
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
      const blob = await removeBg(current.blob);
      pushStep(blob);
    } finally {
      setBusy(false);
    }
  };

  const onUpscale = async () => {
    if (!current) return;
    setBusy(true);
    try {
      const blob = await upscaleImage(current.blob);
      pushStep(blob);
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
        pushStep(blob);
        setFilters(DEFAULT_FILTERS);
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
      const zipBlob = await downloadSingleImage(current.blob, format, quality);

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image_${format}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
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
    if (current) {
      updateImageSize(current.blob);
    } else {
      setImageSize(null);
    }
  }, [current, updateImageSize]);

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
    },
    actions: {
      setFilters,
      resetFilters: () => setFilters(DEFAULT_FILTERS),
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
    },
  };
}
