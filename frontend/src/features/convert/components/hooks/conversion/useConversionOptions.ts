import { useEffect, useState } from "react";
import type { ResizeSize } from "./conversion.types";

export function useConversionOptions(filesCount: number) {
  const [formats, setFormats] = useState<Record<number, string>>({});
  const [quality, setQuality] = useState<Record<number, number>>({});
  const [sizes, setSizes] = useState<Record<number, ResizeSize>>({});

  useEffect(() => {
    const ensure = <T,>(
      prev: Record<number, T>,
      def: () => T
    ): Record<number, T> => {
      const next = { ...prev };
      for (let i = 0; i < filesCount; i++) {
        if (next[i] == null) next[i] = def();
      }
      return next;
    };

    setFormats((p) => ensure(p, () => "webp"));
    setQuality((p) => ensure(p, () => 85));
    setSizes((p) => ensure(p, () => ({ width: null, height: null })));
  }, [filesCount]);

  return {
    formats,
    setFormats,
    quality,
    setQuality,
    sizes,
    setSizes,
  };
}
