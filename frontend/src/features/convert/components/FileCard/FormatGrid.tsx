import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { groupFormats } from "@/features/convert/components/FileCard/classifyFormats";

const collapse = {
  hidden: { height: 0, opacity: 0 },
  show:   { height: "auto", opacity: 1 },
  exit:   { height: 0, opacity: 0 },
};
const gridStagger = { hidden:{opacity:1}, show:{opacity:1, transition:{staggerChildren:0.025}} };
const itemAnim = { hidden:{opacity:0,y:6,scale:0.98}, show:{opacity:1,y:0,scale:1,transition:{duration:0.18}} };

interface Props {
  current: string;
  onPick: (fmt: string) => void;
  availableFormats: string[];
  labelMap: Record<string, string>;
  rememberExpanded?: boolean;
}

export default function FormatGrid({
  current,
  onPick,
  availableFormats,
  labelMap,
  rememberExpanded = true,
}: Props) {
  const grouped = useMemo(() => groupFormats(availableFormats), [availableFormats]);
  const hasAdvanced = grouped.some(s => s.name === "Naukowe/specjalistyczne");
  const base = grouped.filter(s => s.name !== "Naukowe/specjalistyczne");
  const advanced = grouped.filter(s => s.name === "Naukowe/specjalistyczne");

  const [showAdvanced, setShowAdvanced] = useState<boolean>(() => {
    if (!rememberExpanded) return false;
    const raw = localStorage.getItem("fmt_show_advanced");
    return raw === "1";
  });

  useEffect(() => {
    if (rememberExpanded) {
      localStorage.setItem("fmt_show_advanced", showAdvanced ? "1" : "0");
    }
  }, [showAdvanced, rememberExpanded]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
      <div className="text-center text-sm mb-3 text-slate-300">Wybierz format</div>

      {base.map(({ name, items }) => (
        <div key={name} className="mb-3">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-2 px-1">{name}</div>
          <motion.div variants={gridStagger} initial="hidden" animate="show"
            className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {items.map((fName) => {
              const canonical = fName.toLowerCase();
              const label = (labelMap[canonical] ?? canonical).toUpperCase();
              const active = canonical === current;
              return (
                <motion.button
                  variants={itemAnim}
                  key={canonical}
                  onClick={() => onPick(canonical)}
                  className={`rounded-xl px-4 py-3 border text-sm transition
                    ${active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-[rgba(255,255,255,0.06)] text-slate-200 border-white/10 hover:bg-[rgba(255,255,255,0.1)]"}`}
                  type="button"
                  title={canonical}
                >
                  {label}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      ))}

      {hasAdvanced && (
        <>
          <div className="mt-2 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAdvanced(s => !s)}
              className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] inline-flex items-center gap-2"
              aria-expanded={showAdvanced}
            >
              <span>{showAdvanced ? "Ukryj rzadkie formaty" : "Pokaż więcej formatów"}</span>
              <motion.span animate={{ rotate: showAdvanced ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-block">▼</motion.span>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showAdvanced && (
              <motion.div
                key="adv"
                variants={collapse}
                initial="hidden"
                animate="show"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                className="overflow-hidden"
              >
                {advanced.map(({ name, items }) => (
                  <div key={name} className="mt-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400 mb-2 px-1">{name}</div>
                    <motion.div variants={gridStagger} initial="hidden" animate="show"
                      className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {items.map((fName) => {
                        const canonical = fName.toLowerCase();
                        const label = (labelMap[canonical] ?? canonical).toUpperCase();
                        const active = canonical === current;
                        return (
                          <motion.button
                            variants={itemAnim}
                            key={canonical}
                            onClick={() => onPick(canonical)}
                            className={`rounded-xl px-4 py-3 border text-sm transition
                              ${active
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-[rgba(255,255,255,0.06)] text-slate-200 border-white/10 hover:bg-[rgba(255,255,255,0.1)]"}`}
                            type="button"
                            title={canonical}
                          >
                            {label}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
