export default function Range({
  label, min, max, value, onChange, unit, help,
}: {
  label: string;
  min: number; max: number;
  value: number; onChange: (v: number) => void;
  unit?: string;
  help?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
        <span>{label}</span>
        <span className="tabular-nums text-slate-400">{value}{unit ?? ""}</span>
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500"
      />
      {help && <div className="pt-1 text-[11px] text-slate-400">{help}</div>}
    </div>
  );
}
