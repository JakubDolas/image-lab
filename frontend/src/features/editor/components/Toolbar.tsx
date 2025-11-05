type Props = {
  onRemoveBg: () => void;
  canApply: boolean;
  busy: boolean;
};

export default function Toolbar({ onRemoveBg, canApply, busy }: Props) {
  return (
    <div className="h-full w-64 shrink-0 border-r border-white/10 bg-white/[.03] p-3">
      <div className="mb-3 text-xs text-slate-400">Narzędzia</div>

      <button
        type="button"
        disabled={!canApply || busy}
        onClick={onRemoveBg}
        className={`w-full rounded-lg px-3 py-2 text-sm transition
          ${busy
            ? "bg-indigo-500/30 text-slate-300 cursor-not-allowed"
            : canApply
              ? "bg-indigo-600 text-white hover:brightness-110"
              : "bg-white/10 text-slate-300 cursor-not-allowed"}`}
      >
        {busy ? "Usuwanie tła…" : "Usuń tło (AI)"}
      </button>
    </div>
  );
}
