import { useEffect, useState } from "react";
import { getSupportedFormats } from "@/features/convert/api";

const POPULAR = ["jpeg", "png", "webp"];

export function useFormats() {
  const [availableFormats, setAvailableFormats] = useState<string[]>(POPULAR);
  const [labelMap, setLabelMap] = useState<Record<string, string>>({
    jpeg: "jpg",
    tiff: "tif",
  });

  useEffect(() => {
    let cancelled = false;

    getSupportedFormats()
      .then(({ formats, preferred_ext }) => {
        if (cancelled) return;

        const rest = formats.filter((f) => !POPULAR.includes(f));
        setAvailableFormats([...POPULAR, ...rest]);
        setLabelMap(preferred_ext ?? {});
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return { availableFormats, labelMap };
}
