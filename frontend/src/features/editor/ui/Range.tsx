import { AnimatePresence, motion } from "framer-motion";

type Props = {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  help?: string;
};

export default function Range({
  label,
  min,
  max,
  value,
  onChange,
  unit,
  help,
}: Props) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
        <span>{label}</span>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="tabular-nums text-slate-400"
          >
            {value}
            {unit ?? ""}
          </motion.span>
        </AnimatePresence>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500"
      />

      {help && <div className="pt-1 text-[11px] text-slate-400">{help}</div>}
    </div>
  );
}
