import SectionShell from "./SectionShell";
import Range from "@/features/editor/ui/Range";
import { FiEdit3, FiCheckCircle } from "react-icons/fi";
import { TbEraser } from "react-icons/tb";

type Props = {
  openIds: Set<string>;
  toggle: (id: string) => void;

  drawingMode: "off" | "draw" | "erase";
  brushSize: number;
  brushColor: string;

  onToggleDrawing: () => void;
  onToggleEraser: () => void;
  onChangeBrushSize: (v: number) => void;
  onChangeBrushColor: (v: string) => void;

  onApplyDrawingClick: () => void;
};

const SECTION_ID = "drawing";

export default function DrawingSection({
  openIds,
  toggle,
  drawingMode,
  brushSize,
  brushColor,
  onToggleDrawing,
  onToggleEraser,
  onChangeBrushSize,
  onChangeBrushColor,
  onApplyDrawingClick,
}: Props) {
  const isDrawing = drawingMode === "draw";
  const isErase = drawingMode === "erase";

  return (
    <SectionShell
      id={SECTION_ID}
      title="Rysowanie"
      openIds={openIds}
      toggle={toggle}
    >
      <div className="space-y-3">

        <button
          type="button"
          onClick={onToggleDrawing}
          className={
            "flex items-center gap-2 w-full rounded-xl px-3 py-2 text-sm font-medium transition " +
            (isDrawing
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "bg-slate-800 text-slate-100 hover:bg-slate-700")
          }
        >
          <FiEdit3 size={18} />
          {isDrawing ? "Wyłącz rysowanie" : "Rysuj"}
        </button>

        <Range
          label={`Grubość pędzla: ${brushSize}px`}
          min={1}
          max={50}
          value={brushSize}
          onChange={onChangeBrushSize}
        />

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400">Kolor</span>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => onChangeBrushColor(e.target.value)}
            className="h-7 w-14 cursor-pointer rounded border border-white/10 bg-transparent"
          />
        </div>

        <button
          type="button"
          onClick={onToggleEraser}
          className={
            "flex items-center gap-2 w-full rounded-xl px-3 py-2 text-sm font-medium transition " +
            (isErase
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
              : "bg-slate-800 text-slate-100 hover:bg-slate-700")
          }
        >
          <TbEraser size={18} />
          {isErase ? "Tryb rysowania" : "Gumka"}
        </button>


        <button
          type="button"
          onClick={onApplyDrawingClick}
          className="flex items-center justify-center gap-2 w-full rounded-xl px-3 py-2 text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-400 transition"
        >
          <FiCheckCircle size={18} />
          Zastosuj rysunek
        </button>

      </div>
    </SectionShell>
  );
}
