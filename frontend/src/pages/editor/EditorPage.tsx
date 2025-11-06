import { useCallback, useMemo, useRef, useState } from "react";
import UploadArea from "@/features/convert/components/UploadArea";
import Canvas from "@/features/editor/components/Canvas";
import Sidebar from "@/features/editor/components/Sidebar";
import Toolbar from "@/features/editor/components/Toolbar";
import { DEFAULT_FILTERS, type Filters } from "@/features/editor/types";
import { apiApplyFilters, apiExport, apiRemoveBg } from "@/features/editor/api";

export default function EditorPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [steps, setSteps] = useState<Blob[]>([]);
  const [ptr, setPtr] = useState(-1);
  const currentBlob = ptr >= 0 ? steps[ptr] : null;
  const imageUrl = useMemo(() => currentBlob ? URL.createObjectURL(currentBlob) : null, [currentBlob]);

  const [busy, setBusy] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const pushBlob = useCallback((blob: Blob) => {
    setSteps(prev => [...prev.slice(0, ptr + 1), blob]);
    setPtr(p => p + 1);
  }, [ptr]);

  const onPickFile = useCallback((file: File) => {
    pushBlob(file);
    setFilters(DEFAULT_FILTERS);
  }, [pushBlob]);

  const onUndo = () => setPtr(p => Math.max(-1, p - 1));
  const onRedo = () => setPtr(p => Math.min(steps.length - 1, p + 1));
  const pickOther = () => inputRef.current?.click();

  const onApplyFilters = async () => {
    if (!currentBlob) return;
    setBusy(true);
    try {
      const blob = await apiApplyFilters(currentBlob, filters);
      pushBlob(blob);
    } finally { setBusy(false); }
  };

  const onRemoveBg = async () => {
    if (!currentBlob) return;
    setBusy(true);
    try {
      const blob = await apiRemoveBg(currentBlob);
      pushBlob(blob);
    } finally { setBusy(false); }
  };

  const onDownload = async () => {
    if (!currentBlob) return;
    setBusy(true);
    try {
      const blob = await apiExport(currentBlob, "png", 95);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "image.png"; a.click();
      URL.revokeObjectURL(url);
    } finally { setBusy(false); }
  };

  if (!imageUrl) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 sm:p-5">
          <ol className="space-y-2">
            {[
              {n:1,t:"Dodaj zdjęcie"},
              {n:2,t:"Użyj narzędzi edytora"},
              {n:3,t:"Pobierz efekt albo edytuj dalej"}].map(s=>(
              <li key={s.n} className="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-indigo-500/15">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-sm text-indigo-300 group-hover:bg-indigo-500/30">{s.n}</span>
                <span className="text-sm font-medium group-hover:text-indigo-200">{s.t}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-white/10 p-5 bg-gradient-to-br from-indigo-500/10 via-slate-800/30 to-slate-900/40">
          <div className="rounded-2xl border-2 border-dashed border-white/15 p-8">
            <UploadArea onFiles={(files) => files[0] && onPickFile(files[0])} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1300px]">
      <div className="flex gap-4">
        <Sidebar
          busy={busy}
          onRemoveBg={onRemoveBg}
          onPickOther={pickOther}
          filters={filters}
          setFilters={setFilters}
          onResetFilters={() => setFilters(DEFAULT_FILTERS)}
          onApplyFilters={onApplyFilters}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Toolbar
            busy={busy}
            canUndo={ptr > 0}
            canRedo={ptr < steps.length - 1}
            onUndo={onUndo}
            onRedo={onRedo}
            onPickOther={pickOther}
            onDownload={onDownload}
          />
          <Canvas imageUrl={imageUrl} onPickFile={onPickFile} />
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickFile(f); e.currentTarget.value = ""; }} />
    </div>
  );
}
