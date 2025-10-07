interface FormatPickerProps {
  target: string;
  setTarget: React.Dispatch<React.SetStateAction<string>>;
}
const PRESETS = ["jpg", "png", "webp"];

export default function FormatPicker({ target, setTarget }: FormatPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((fmt) => (
        <button
          key={fmt}
          onClick={() => setTarget(fmt)}
          className={`px-4 py-2 rounded-xl border transition ${
            target === fmt
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          .{fmt}
        </button>
      ))}
    </div>
  );
}
