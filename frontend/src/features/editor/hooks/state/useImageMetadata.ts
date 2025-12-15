import { useEffect, useState } from "react";
import type { ImageSize } from "../types/editorTypes";

export function useImageMetadata(current: any) {
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [colorSpace] = useState("RGB");

  useEffect(() => {
    if (!current) return;

    const img = new Image();
    const url = URL.createObjectURL(current.blob);
    img.src = url;

    img.onload = () => {
      setImageSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      URL.revokeObjectURL(url);
    };
  }, [current]);

  return { imageSize, colorSpace };
}
