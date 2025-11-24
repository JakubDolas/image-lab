import { useSupportedFormats } from "@/features/editor/hooks/useSupportedFormats";

type Props = {
  open: boolean;
  valueFormat: string;
  valueQuality: number;
  onChangeFormat: (fmt: string) => void;
  onChangeQuality: (q: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

function formatSupportsQuality(fmt: string) {
  if (!fmt) return false;
  const f = fmt.toLowerCase();
  return ["jpeg", "jpg", "webp"].includes(f);
}

export default function DownloadModal({
  open,
  valueFormat,
  valueQuality,
  onChangeFormat,
  onChangeQuality,
  onCancel,
  onConfirm,
}: Props) {
  const { formats, preferredExt, loading, error } = useSupportedFormats();

  if (!open) return null;

  const hasFormats = !loading && formats.length > 0;
  const supportsQuality = formatSupportsQuality(valueFormat);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-[#080819] px-7 py-6 shadow-2xl border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-1">
          Pobierz obraz
        </h2>
        <p className="mb-5 text-xs text-slate-300">
          Wybierz format pliku i (opcjonalnie) jakość kompresji.
        </p>

        <label className="mb-2 block text-xs font-medium text-slate-200">
          Format pliku:
        </label>
        <div className="relative mb-3">
          <select
            className="nice-scrollbar select-dark w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-slate-100 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!hasFormats || loading}
            value={hasFormats ? valueFormat : ""}
            onChange={(e) => onChangeFormat(e.target.value)}
          >
            {loading && <option>Ładowanie formatów...</option>}
            {!loading && formats.length === 0 && (
              <option>Brak dostępnych formatów</option>
            )}
            {!loading &&
              formats.map((fmt) => {
                const label = preferredExt[fmt] ?? fmt;
                return (
                  <option key={fmt} value={fmt}>
                    {label.toUpperCase()}
                  </option>
                );
              })}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
            ▾
          </div>
        </div>

        {error && (
          <p className="mb-3 text-xs text-red-400">
            {error}
          </p>
        )}

        <div
          className={`
            mt-4 origin-top transition-all duration-300 ease-out
            ${supportsQuality
              ? "max-h-24 opacity-100 scale-y-100"
              : "max-h-0 opacity-0 scale-y-95 pointer-events-none"}
          `}
        >
          <label className="mb-1 block text-xs font-medium text-slate-200">
            Jakość:
          </label>

          <input
            type="range"
            min={10}
            max={100}
            step={1}
            value={valueQuality}
            onChange={(e) => onChangeQuality(Number(e.target.value))}
            className="w-full accent-purple-500"
          />

          <div className="mt-1 text-right text-[11px] text-slate-300">
            {valueQuality}%
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-100 hover:bg-white/10"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!hasFormats}
            className="rounded-xl bg-indigo-500 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-400 disabled:opacity-50"
          >
            Pobierz
          </button>
        </div>
      </div>
    </div>
  );
}
