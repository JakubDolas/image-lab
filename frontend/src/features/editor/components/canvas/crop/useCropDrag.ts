import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import type { CropRect } from "@/features/editor/types";
import type { DragKind, DragState } from "./crop.types";

export function useCropDrag(
  rect: CropRect | null,
  onChange: (rect: CropRect) => void
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  useEffect(() => {
    if (!rect) {
      onChange({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
    }
  }, [rect, onChange]);

  const current = rect ?? { x: 0.1, y: 0.1, width: 0.8, height: 0.8 };

  const beginDrag =
    (kind: DragKind) => (e: ReactMouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const box = containerRef.current?.getBoundingClientRect();
      if (!box) return;

      setDrag({
        kind,
        startX: e.clientX,
        startY: e.clientY,
        startRect: current,
        boxWidth: box.width,
        boxHeight: box.height,
      });
    };

  useEffect(() => {
    if (!drag) return;

    const handleMove = (e: MouseEvent) => {
      const dx = (e.clientX - drag.startX) / drag.boxWidth;
      const dy = (e.clientY - drag.startY) / drag.boxHeight;

      let { x, y, width, height } = drag.startRect;

      if (drag.kind === "move") {
        x += dx;
        y += dy;
      } else if (drag.kind === "nw") {
        x += dx;
        y += dy;
        width -= dx;
        height -= dy;
      } else if (drag.kind === "ne") {
        y += dy;
        width += dx;
        height -= dy;
      } else if (drag.kind === "sw") {
        x += dx;
        width -= dx;
        height += dy;
      } else if (drag.kind === "se") {
        width += dx;
        height += dy;
      }

      width = Math.max(0.05, Math.min(1, width));
      height = Math.max(0.05, Math.min(1, height));
      x = Math.min(Math.max(0, x), 1 - width);
      y = Math.min(Math.max(0, y), 1 - height);

      onChange({ x, y, width, height });
    };

    const handleUp = () => setDrag(null);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [drag, onChange]);

  const style: CSSProperties = {
    left: `${current.x * 100}%`,
    top: `${current.y * 100}%`,
    width: `${current.width * 100}%`,
    height: `${current.height * 100}%`,
  };

  return {
    containerRef,
    style,
    beginDrag,
  };
}
