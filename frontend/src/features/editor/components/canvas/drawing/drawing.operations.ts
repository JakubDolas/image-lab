export function applyDrawingOperation(
  img: HTMLImageElement,
  overlay: HTMLCanvasElement,
  cssFilter: string,
  onApplyDrawing: (blob: Blob) => void,
  hasDrawnRef: React.MutableRefObject<boolean>
) {
  if (!hasDrawnRef.current) return;

  const w = overlay.width;
  const h = overlay.height;
  if (!w || !h) return;

  const merged = document.createElement("canvas");
  merged.width = w;
  merged.height = h;

  const ctx = merged.getContext("2d");
  if (!ctx) return;

  ctx.filter = cssFilter;
  ctx.drawImage(img, 0, 0, w, h);

  ctx.filter = "none";
  ctx.drawImage(overlay, 0, 0, w, h);

  merged.toBlob((blob) => {
    if (!blob) return;

    onApplyDrawing(blob);

    const octx = overlay.getContext("2d");
    if (octx) {
      octx.clearRect(0, 0, overlay.width, overlay.height);
    }

    hasDrawnRef.current = false;
  }, "image/png");
}

export function clearDrawingOperation(
  overlay: HTMLCanvasElement,
  hasDrawnRef: React.MutableRefObject<boolean>,
  isDrawingRef: React.MutableRefObject<boolean>,
  lastPointRef: React.MutableRefObject<any>
) {
  const ctx = overlay.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, overlay.width, overlay.height);

  hasDrawnRef.current = false;
  isDrawingRef.current = false;
  lastPointRef.current = null;
}
