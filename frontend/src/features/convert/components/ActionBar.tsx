interface Props {
  canStart: boolean;
  canDownload: boolean;
  onStart: () => void;
  onDownload: () => void;
  busy: boolean;
}
export default function ActionBar({ canStart, canDownload, onStart, onDownload, busy }: Props) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onStart}
        disabled={!canStart || busy}
        className={`px-5 py-3 rounded-2xl font-semibold transition
          ${canStart && !busy ? "bg-indigo-500 text-white hover:brightness-110"
                              : "bg-[rgba(255,255,255,0.06)] text-slate-300 cursor-not-allowed"}`}
      >
        {busy ? "Przetwarzanie..." : "Konwertuj wszystko"}
      </button>

      <button
        onClick={onDownload}
        disabled={!canDownload || busy}
        className={`px-5 py-3 rounded-2xl font-semibold transition
          ${!canDownload || busy
            ? "bg-[rgba(255,255,255,0.06)] text-slate-300 cursor-not-allowed"
            : "bg-[rgba(255,255,255,0.06)] text-slate-100 hover:bg-[rgba(255,255,255,0.1)]"}`}
      >
        Pobierz
      </button>
    </div>
  );
}
