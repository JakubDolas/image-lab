interface Props {
  value: number;
  onChange: (v: number) => void;
  enabled: boolean;
}
export default function QualitySlider({ value, onChange, enabled }: Props) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm text-slate-300 shrink-0">Jakość</label>
      <input
        type="range"
        min={1}
        max={100}
        disabled={!enabled}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${enabled ? "accent-indigo-500" : "opacity-50 cursor-not-allowed"}`}
      />
      <div className="w-10 text-right text-sm tabular-nums">{value}</div>
    </div>
  );
}
