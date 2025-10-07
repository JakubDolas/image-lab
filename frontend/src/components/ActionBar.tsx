interface ActionBarProps {
  canStart: boolean;
  onStart: () => void;
  onDownload: () => void;
  busy: boolean;
}

export default function ActionBar({ canStart, onStart, onDownload, busy }: ActionBarProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onStart}
        disabled={!canStart || busy}
        className={`px-6 py-3 rounded-xl text-white ${
          canStart && !busy ? "bg-orange-500 hover:opacity-90" : "bg-gray-300"
        }`}
      >
        {busy ? "Przetwarzanie..." : "Rozpocznij proces"}
      </button>
      <button
        onClick={onDownload}
        disabled={busy}
        className="px-6 py-3 rounded-xl text-white bg-green-600 disabled:bg-gray-300"
      >
        Pobierz
      </button>
    </div>
  );
}
