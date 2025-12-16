import { useCropDrag } from "./useCropDrag";
import type { DragKind, OverlayProps } from "./crop.types";

export function CropOverlay({ rect, onChange }: OverlayProps) {
  const { containerRef, style, beginDrag } = useCropDrag(rect, onChange);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      <div
        className="pointer-events-auto absolute rounded-lg border-2 border-indigo-400 bg-black/20 shadow-[0_0_0_10000px_rgba(0,0,0,0.35)]"
        style={style}
        onMouseDown={beginDrag("move")}
      >
        {(["nw", "ne", "sw", "se"] as DragKind[]).map((k) => {
          const base =
            "absolute h-3 w-3 rounded-full border border-white bg-indigo-400 shadow";
          const pos =
            k === "nw"
              ? "left-[-6px] top-[-6px]"
              : k === "ne"
              ? "right-[-6px] top-[-6px]"
              : k === "sw"
              ? "left-[-6px] bottom-[-6px]"
              : "right-[-6px] bottom-[-6px]";

          return (
            <div
              key={k}
              className={`${base} ${pos} cursor-pointer`}
              onMouseDown={beginDrag(k)}
            />
          );
        })}
      </div>
    </div>
  );
}
