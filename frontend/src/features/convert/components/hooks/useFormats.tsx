import { useEffect, useState } from "react";
import { getSupportedFormats } from "@/features/convert/api";
import type { SupportedFormatsResponse } from "@/features/convert/api";

const POPULAR_FORMATS = ["jpeg", "png", "webp"] as const;

export function useFormats() {
  const [availableFormats, setAvailableFormats] = useState<string[]>(
    [...POPULAR_FORMATS]
  );

  const [labelMap, setLabelMap] = useState<Record<string, string>>({
    jpeg: "jpg",
    tiff: "tif",
  });

  useEffect(() => {
    let cancelled = false;

    getSupportedFormats()
      .then((data: SupportedFormatsResponse) => {
        if (cancelled) return;

        const rest = data.formats.filter(
          (f) => !POPULAR_FORMATS.includes(f as any)
        );

        setAvailableFormats([...POPULAR_FORMATS, ...rest]);
        setLabelMap(data.preferred_ext ?? {});
      })
      .catch(() => {
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { availableFormats, labelMap };
}
