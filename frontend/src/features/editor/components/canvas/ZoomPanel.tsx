type Props = {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

export function ZoomPanel({
  zoom,
  minZoom,
  maxZoom,
  onZoomIn,
  onZoomOut,
  onReset,
}: Props) {
  return (
    <div
      className="
        pointer-events-auto
        absolute bottom-4 right-4
        flex items-center gap-2
        rounded-full
        bg-[rgba(12,10,24,0.9)]
        border border-white/10
        px-3 py-1.5
        text-xs text-slate-100
        shadow-[0_10px_30px_rgba(0,0,0,0.55)]
        backdrop-blur
      "
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-slate-200"
        >
          <circle cx="11" cy="11" r="6" strokeWidth="2" />
          <line
            x1="16"
            y1="16"
            x2="21"
            y2="21"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <button
        type="button"
        onClick={onZoomOut}
        disabled={zoom <= minZoom}
        className="
          flex h-7 w-7 items-center justify-center
          rounded-full border border-white/15
          bg-white/5
          text-sm
          hover:bg-white/10 disabled:opacity-40
        "
      >
        −
      </button>

      <button
        type="button"
        onClick={onReset}
        className="px-2 text-[11px] font-medium text-slate-100"
      >
        {Math.round(zoom * 100)}%
      </button>

      <button
        type="button"
        onClick={onZoomIn}
        disabled={zoom >= maxZoom}
        className="
          flex h-7 w-7 items-center justify-center
          rounded-full border border-white/15
          bg-indigo-500
          text-sm
          hover:bg-indigo-400 disabled:opacity-40
        "
      >
        +
      </button>
    </div>
  );
}
