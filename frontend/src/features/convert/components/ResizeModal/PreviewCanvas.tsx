import React from "react";
import type { Handle, PreviewState } from "./types";

function Edge({ pos, onDown }: { pos: "n" | "s" | "e" | "w"; onDown: (e: React.PointerEvent) => void }) {
  const common = "absolute bg-indigo-500/60 hover:bg-indigo-500 transition rounded select-none";
  const thick = 8;
  const style: React.CSSProperties =
    pos === "n" ? { top: -thick / 2, left: 12, right: 12, height: thick, cursor: "ns-resize" } :
    pos === "s" ? { bottom: -thick / 2, left: 12, right: 12, height: thick, cursor: "ns-resize" } :
    pos === "e" ? { right: -thick / 2, top: 12, bottom: 12, width: thick, cursor: "ew-resize" } :
                  { left: -thick / 2, top: 12, bottom: 12, width: thick, cursor: "ew-resize" };
  return <div onPointerDown={onDown} className={common} style={style} />;
}

function Corner({ pos, onDown }: { pos: "nw" | "ne" | "sw" | "se"; onDown: (e: React.PointerEvent) => void }) {
  const size = 18;
  const common = "absolute rounded-full bg-indigo-500 shadow-lg ring-4 ring-indigo-500/20 select-none";
  const style: React.CSSProperties =
    pos === "nw" ? { left: -size / 2, top: -size / 2, width: size, height: size, cursor: "nwse-resize" } :
    pos === "ne" ? { right: -size / 2, top: -size / 2, width: size, height: size, cursor: "nesw-resize" } :
    pos === "sw" ? { left: -size / 2, bottom: -size / 2, width: size, height: size, cursor: "nesw-resize" } :
                   { right: -size / 2, bottom: -size / 2, width: size, height: size, cursor: "nwse-resize" };
  return <div onPointerDown={onDown} className={common} style={style} title="Przeciągnij, aby zmienić rozmiar" />;
}

export default function PreviewCanvas({
  url,
  keepAspect,
  boxRef,
  preview,
  onStartResize,
  onRefit,
}: {
  url: string;
  keepAspect: boolean;
  boxRef: React.RefObject<HTMLDivElement | null>;
  preview: PreviewState;
  onStartResize: (h: Handle, e: React.PointerEvent) => void;
  onRefit: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <div
        ref={boxRef}
        className="mx-auto relative rounded bg-black/10 overflow-hidden"
        style={{ width: "100%", height: "min(52vh, 520px)" }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: preview.pw, height: preview.ph }}
        >
          {!!url && (
            <img
              src={url}
              alt=""
              draggable={false}
              className="select-none pointer-events-none"
              style={{
                width: "100%",
                height: "100%",
                objectFit: keepAspect ? "contain" : "fill",
                imageRendering: "auto",
              }}
            />
          )}

          <Edge pos="n" onDown={(e) => onStartResize("n", e)} />
          <Edge pos="s" onDown={(e) => onStartResize("s", e)} />
          <Edge pos="e" onDown={(e) => onStartResize("e", e)} />
          <Edge pos="w" onDown={(e) => onStartResize("w", e)} />
          <Corner pos="nw" onDown={(e) => onStartResize("nw", e)} />
          <Corner pos="ne" onDown={(e) => onStartResize("ne", e)} />
          <Corner pos="sw" onDown={(e) => onStartResize("sw", e)} />
          <Corner pos="se" onDown={(e) => onStartResize("se", e)} />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
        <div>
          Wyświetlany: <b>{preview.pw}×{preview.ph}</b> px • Docelowy: <b>{preview.dw}×{preview.dh}</b> px • Skala: <b>{Math.round(preview.s * 100)}%</b>
        </div>
        <button
          type="button"
          onClick={onRefit}
          className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/10 hover:bg-white/15"
        >
          Dopasuj ponownie
        </button>
      </div>
    </div>
  );
}
