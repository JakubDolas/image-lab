import { useState, type SyntheticEvent } from "react";

export function useViewportImage(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onAfterLoad: () => void
) {
  const [imgDim, setImgDim] = useState<{ w: number; h: number } | null>(null);
  const [baseScale, setBaseScale] = useState(1);

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    const natW = el.naturalWidth;
    const natH = el.naturalHeight;

    setImgDim({ w: natW, h: natH });

    if (containerRef.current && natW > 0 && natH > 0) {
      const cw = containerRef.current.clientWidth;
      const ch = containerRef.current.clientHeight;

      if (cw > 0 && ch > 0) {
        const scaleToFit = Math.min(cw / natW, ch / natH);
        setBaseScale(scaleToFit < 1 ? scaleToFit : 1);
      } else {
        setBaseScale(1);
      }
    } else {
      setBaseScale(1);
    }

    onAfterLoad();
  };

  return {
    imgDim,
    baseScale,
    onImageLoad,
  };
}
