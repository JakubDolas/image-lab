import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RATIOS, PRESET_WIDTHS, type RatioId } from "./presets";
import type { Props } from "./types";

export default function ControlsPanel({
  nat,
  w, h,
  keepAspect, setKeepAspect,
  limitToOrig, setLimitToOrig,
  onChangeW, onChangeH,
  onPickSize,
  onApply, onClose,
}: Props) {
  const [portrait, setPortrait] = useState(h > w);
  const [picked, setPicked] = useState<RatioId | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<{ w: number; h: number } | null>(null);

  const activeRatio = useMemo(() => {
    if (!picked) return null;
    return RATIOS.find(r => r.id === picked) ?? null;
  }, [picked]);

  function clampToOriginal(W: number, H: number) {
    if (!limitToOrig || !nat) return { W, H };
    return { W: Math.min(W, nat.w), H: Math.min(H, nat.h) };
  }

  function pickRatio(r: RatioId) {
    setPicked(prev => (prev === r ? null : r));
    setKeepAspect(true);
  }

  function applyPreset(r: RatioId, widthLandscape: number) {
    const ratio = RATIOS.find(x => x.id === r)!;
    let W = widthLandscape;
    let H = Math.round(W * ratio.h / ratio.w);
    if (portrait) [W, H] = [H, W];
    ({ W, H } = clampToOriginal(W, H));
    setKeepAspect(false);
    onPickSize(W, H);
    setSelectedPreset({ w: W, h: H });

  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
      <div className="mb-4">
        <div className="text-[13px] text-slate-400">Oryginał</div>
        <div className="text-sm font-medium text-slate-200">
          {nat ? <span>{nat.w}×{nat.h} px</span> : "—"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-[11px] uppercase tracking-wide text-slate-400 mb-1">Szerokość</label>
          <input
            type="number"
            className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            value={w || ""}
            min={1}
            onChange={(e) => onChangeW(Number(e.target.value || 0))}
            placeholder="W"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wide text-slate-400 mb-1">Wysokość</label>
          <input
            type="number"
            className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            value={h || ""}
            min={1}
            onChange={(e) => onChangeH(Number(e.target.value || 0))}
            placeholder="H"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-4">
        <label className="inline-flex items-center gap-2 text-[13px] text-slate-200">
          <input
            type="checkbox"
            className="accent-indigo-500"
            checked={keepAspect}
            onChange={(e) => setKeepAspect(e.target.checked)}
          />
          Zachowaj proporcje
        </label>
        <label className="inline-flex items-center gap-2 text-[13px] text-slate-200">
          <input
            type="checkbox"
            className="accent-indigo-500"
            checked={limitToOrig}
            onChange={(e) => setLimitToOrig(e.target.checked)}
          />
          Nie powiększaj
        </label>
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] tracking-wide text-slate-400">Wybierz proporcje</span>
          <div className="inline-flex p-1 rounded-xl bg-white/5 ring-1 ring-white/10">
            <button
              type="button"
              onClick={() => setPortrait(false)}
              className={`px-3 py-1.5 text-xs rounded-lg transition
                ${!portrait ? "bg-indigo-600 text-white shadow ring-1 ring-indigo-400/60" : "text-slate-300 hover:bg-white/10"}`}
              title="Poziom"
            >Poziom</button>
            <button
              type="button"
              onClick={() => setPortrait(true)}
              className={`px-3 py-1.5 text-xs rounded-lg transition
                ${portrait ? "bg-indigo-600 text-white shadow ring-1 ring-indigo-400/60" : "text-slate-300 hover:bg-white/10"}`}
              title="Pion"
            >Pion</button>
          </div>
        </div>

        <div className="p-1 rounded-xl ring-1 ring-white/10 bg-white/[0.04]">
          <div
            className="grid gap-2
                      [grid-template-columns:repeat(auto-fit,minmax(84px,1fr))]"
          >
            {RATIOS.map(r => (
              <motion.button
                key={r.id}
                type="button"
                onClick={() => pickRatio(r.id)}
                whileTap={{ scale: 0.97 }}
                className={`h-9 w-full rounded-lg text-sm transition shadow-sm
                  ${picked === r.id
                    ? "bg-gradient-to-b from-indigo-600 to-indigo-500 text-white shadow ring-1 ring-indigo-400/60"
                    : "text-slate-200 hover:bg-white/10 ring-1 ring-transparent"}`}
              >
                {r.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {activeRatio && (
          <motion.div
            key={activeRatio.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between mt-3 mb-2">
              <span className="text-[12px] text-slate-400">
                Rozdzielczości {activeRatio.label} ({portrait ? "pion" : "poziom"})
              </span>
              <button
                type="button"
                onClick={() => setPicked(null)}
                className="px-2 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 ring-1 ring-white/10"
                title="Zwiń"
              >
                Reset
              </button>
            </div>

            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1 rounded-xl ring-1 ring-white/10 bg-white/[0.03] p-2"
            >
              {PRESET_WIDTHS[activeRatio.id].map(WL => {
                let W = WL;
                let H = Math.round(W * activeRatio.h / activeRatio.w);
                if (portrait) [W, H] = [H, W];

                const tooBig = !!(limitToOrig && nat && (W > nat.w || H > nat.h));

                const isActive = selectedPreset?.w === W && selectedPreset?.h === H;

                return (
                  <motion.button
                    key={`${activeRatio.id}-${WL}-${portrait ? "p" : "l"}`}
                    type="button"
                    disabled={tooBig}
                    onClick={() => !tooBig && applyPreset(activeRatio.id, WL)}
                    whileHover={!tooBig ? { scale: 1.03 } : undefined}
                    whileTap={!tooBig ? { scale: 0.96 } : undefined}
                    className={`h-10 px-3 rounded-lg text-sm ring-1 transition font-medium shadow-sm
                      ${
                        tooBig
                          ? "opacity-40 cursor-not-allowed line-through"
                          : isActive
                          ? "bg-indigo-600 text-white ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                          : "bg-white/5 text-slate-200 hover:bg-white/10 ring-white/10"
                      }`}
                    title={tooBig ? "Większe niż oryginał" : `Ustaw ${W}×${H}`}
                  >
                    {W}×{H}
                  </motion.button>
                );
              })}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 text-slate-200"
        >
          Anuluj
        </button>
        <button
          onClick={onApply}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:brightness-110 shadow ring-1 ring-indigo-400/60"
        >
          Zastosuj
        </button>
      </div>
    </div>
  );
}
