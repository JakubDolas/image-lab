import React from "react";
import type { Handle, PreviewState, ResizeModalProps } from "./types";

function cursorFor(h: Handle) {
  switch (h) {
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    case "nw":
    case "se":
      return "nwse-resize";
  }
}

export function useResizeState(props: Omit<ResizeModalProps, "onApply" | "onClose"> & {
  onApply: ResizeModalProps["onApply"];
  onClose: ResizeModalProps["onClose"];
}) {
  const {
    file,
    initialWidth,
    initialHeight,
    keepAspectDefault = true,
    limitToOriginalDefault = false,
    onApply,
    onClose,
  } = props;

  const [url, setUrl] = React.useState("");
  const [nat, setNat] = React.useState<{ w: number; h: number } | null>(null);

  const [w, setW] = React.useState<number>(initialWidth ?? 0);
  const [h, setH] = React.useState<number>(initialHeight ?? 0);
  const [keepAspect, setKeepAspect] = React.useState(keepAspectDefault);
  const [limitToOrig, setLimitToOrig] = React.useState(limitToOriginalDefault);

  const [lockScale, setLockScale] = React.useState<number | null>(null);

  React.useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    const img = new Image();
    img.onload = () => {
      setNat({ w: img.naturalWidth, h: img.naturalHeight });
      setW(initialWidth ?? img.naturalWidth);
      setH(initialHeight ?? img.naturalHeight);
    };
    img.src = u;
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const aspect = React.useMemo(() => (nat ? nat.w / nat.h : 1), [nat]);

  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });

  React.useEffect(() => {
    if (!boxRef.current) return;
    const el = boxRef.current;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setBox({ w: r.width, h: r.height });
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    setBox({ w: r.width, h: r.height });
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (!box.w || !box.h || !w || !h) return;
    setLockScale((prev) => {
      if (prev != null) return prev;
      const first = Math.min(1, Math.min(box.w / w, box.h / h));
      return isFinite(first) && first > 0 ? first : 1;
    });
  }, [box.w, box.h, w, h]);

  const preview: PreviewState = React.useMemo(() => {
    const targetW = Math.max(1, w || 1);
    const targetH = Math.max(1, h || 1);
    const fit = Math.min(box.w / targetW, box.h / targetH);
    const base = lockScale ?? Math.min(1, fit);
    const s = Math.min(base, fit);
    return {
      s,
      pw: Math.round(targetW * s),
      ph: Math.round(targetH * s),
      dw: targetW,
      dh: targetH,
    };
  }, [box.w, box.h, w, h, lockScale]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const drag = React.useRef<{
    handle: Handle | null;
    startX: number;
    startY: number;
    baseW: number;
    baseH: number;
  }>({ handle: null, startX: 0, startY: 0, baseW: 0, baseH: 0 });

  const startResize = (handle: Handle, ev: React.PointerEvent) => {
    const el = ev.currentTarget as Element;
    (el as any).setPointerCapture?.(ev.pointerId);
    document.body.style.cursor = cursorFor(handle);
    drag.current = {
      handle,
      startX: ev.clientX,
      startY: ev.clientY,
      baseW: w,
      baseH: h,
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const onMove = (ev: PointerEvent) => {
    const { handle, startX, startY, baseW, baseH } = drag.current;
    if (!handle) return;

    const s = preview.s || 1;
    const dx = Math.round((ev.clientX - startX) / s);
    const dy = Math.round((ev.clientY - startY) / s);

    let nextW = baseW;
    let nextH = baseH;

    const hE = handle.includes("e");
    const hW = handle.includes("w");
    const hN = handle.includes("n");
    const hS = handle.includes("s");

    if (hE) nextW = baseW + dx;
    if (hW) nextW = baseW - dx;
    if (hS) nextH = baseH + dy;
    if (hN) nextH = baseH - dy;

    if (keepAspect) {
      if ((hN || hS) && !(hE || hW)) {
        nextH = Math.max(1, nextH);
        nextW = Math.round(nextH * aspect);
      }
      if ((hE || hW) && !(hN || hS)) {
        nextW = Math.max(1, nextW);
        nextH = Math.round(nextW / aspect);
      }
      if ((hE || hW) && (hN || hS)) {
        const dW = Math.abs(nextW - baseW);
        const dH = Math.abs(nextH - baseH);
        if (dW >= dH) {
          nextW = Math.max(1, nextW);
          nextH = Math.round(nextW / aspect);
        } else {
          nextH = Math.max(1, nextH);
          nextW = Math.round(nextH * aspect);
        }
      }
    }

    if (limitToOrig && nat) {
      nextW = Math.min(nextW, nat.w);
      nextH = Math.min(nextH, nat.h);
    }

    setW(Math.max(1, nextW));
    setH(Math.max(1, nextH));
  };

  const onUp = (ev: PointerEvent) => {
    try {
      (ev.target as any).releasePointerCapture?.(ev.pointerId);
    } catch {}
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    document.body.style.cursor = "";
    drag.current.handle = null;
  };

  const changeW = (val: number) => {
    if (!nat) return;
    let x = Math.round(val);
    if (limitToOrig) x = Math.min(x, nat.w);
    x = Math.max(1, x);
    if (keepAspect) {
      setW(x);
      setH(Math.max(1, Math.round(x / (aspect || 1))));
    } else setW(x);
  };

  const changeH = (val: number) => {
    if (!nat) return;
    let y = Math.round(val);
    if (limitToOrig) y = Math.min(y, nat.h);
    y = Math.max(1, y);
    if (keepAspect) {
      setH(y);
      setW(Math.max(1, Math.round(y * (aspect || 1))));
    } else setH(y);
  };

  const apply = () => onApply({ width: w, height: h });

  const refit = () => {
    if (!box.w || !box.h || !w || !h) return;
    const next = Math.min(1, Math.min(box.w / w, box.h / h));
    setLockScale(isFinite(next) && next > 0 ? next : 1);
  };

  const setExactSize = (W: number, H: number) => {
    if (limitToOrig && nat) {
      W = Math.min(W, nat.w);
      H = Math.min(H, nat.h);
    }
    setW(Math.max(1, Math.round(W)));
    setH(Math.max(1, Math.round(H)));
  };

  return {
    url, nat, w, h, keepAspect, limitToOrig, preview, boxRef,
    setKeepAspect, setLimitToOrig,
    startResize, changeW, changeH, apply, refit, onClose, setExactSize
    
  };
}
