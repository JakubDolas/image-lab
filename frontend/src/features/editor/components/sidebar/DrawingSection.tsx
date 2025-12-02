import { AnimatePresence, motion } from "framer-motion";
import { FiEdit3, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { TbEraser } from "react-icons/tb";
import SectionShell from "./SectionShell";
import Range from "@/features/editor/ui/Range";

type Props = {
  openIds: Set<string>;
  toggle: (id: string) => void;

  drawingMode: "off" | "draw" | "erase";
  brushSize: number;
  brushColor: string;

  onSetDraw: () => void;
  onSetErase: () => void;
  onCancelDrawingClick: () => void;
  onApplyDrawingClick: () => void;
  onChangeBrushSize: (v: number) => void;
  onChangeBrushColor: (v: string) => void;
};

const SECTION_ID = "drawing";

export default function DrawingSection({
  openIds,
  toggle,
  drawingMode,
  brushSize,
  brushColor,
  onSetDraw,
  onSetErase,
  onCancelDrawingClick,
  onApplyDrawingClick,
  onChangeBrushSize,
  onChangeBrushColor,
}: Props) {
  const isDrawing = drawingMode !== "off";
  const isBrush = drawingMode === "draw";
  const isErase = drawingMode === "erase";

  return (
    <SectionShell
      id={SECTION_ID}
      title="Rysowanie"
      openIds={openIds}
      toggle={toggle}
    >
      <div className="space-y-3">

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSetDraw}
            className={
              "flex-1 flex items-center justify-center rounded-xl p-2 transition " +
              (isBrush
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                : "bg-slate-800 text-slate-100 hover:bg-slate-700")
            }
          >
            <FiEdit3 size={20} />
          </button>

          <button
            type="button"
            onClick={onSetErase}
            className={
              "flex-1 flex items-center justify-center rounded-xl p-2 transition " +
              (isErase
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                : "bg-slate-800 text-slate-100 hover:bg-slate-700")
            }
          >
            <TbEraser size={20} />
          </button>
        </div>

        <Range
          label={`Grubość: ${brushSize}px`}
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

        <AnimatePresence>
          {isDrawing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="flex gap-2"
            >
              <button
                type="button"
                onClick={onApplyDrawingClick}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-400 transition"
              >
                <FiCheckCircle size={18} />
                Zastosuj
              </button>

              <button
                type="button"
                onClick={onCancelDrawingClick}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-slate-700 text-slate-100 hover:bg-slate-600 transition"
              >
                <FiXCircle size={18} />
                Anuluj
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}
