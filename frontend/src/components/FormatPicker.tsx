interface FormatPickerProps {
  target: string;
  setTarget: React.Dispatch<React.SetStateAction<string>>;
}

const PRESETS = ["jpg", "png", "webp"];

export default function FormatPicker({ target, setTarget }: FormatPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((fmt) => {
        const active = target === fmt;
        return (
          <button
            key={fmt}
            onClick={() => setTarget(fmt)}
            className={`px-4 py-2 rounded-xl border text-sm transition
              ${active
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-[rgba(255,255,255,0.06)] text-slate-200 border-white/10 hover:bg-[rgba(255,255,255,0.1)]"}`}
            type="button"
          >
            .{fmt}
          </button>
        );
      })}
    </div>
  );
}
