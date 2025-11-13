export default function Toolbar({
  canUndo, canRedo, onUndo, onRedo, onPickOther, onDownload, busy,
}: {
  canUndo: boolean; canRedo: boolean;
  onUndo: () => void; onRedo: () => void;
  onPickOther: () => void; onDownload: () => void;
  busy: boolean;
}) {
  const btn = "rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-50";
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-2">
      <button className={btn} onClick={onUndo} disabled={!canUndo || busy}>Cofnij</button>
      <button className={btn} onClick={onRedo} disabled={!canRedo || busy}>Do przodu</button>
      <div className="mx-2 h-6 w-px bg-white/10" />
      <button className={btn} onClick={onPickOther} disabled={busy}>Wybierz inny plik</button>
      <div className="grow" />
      <button className={btn} onClick={onDownload} disabled={busy}>Pobierz</button>
    </div>
  );
}
