import { useCallback, useMemo, useRef, useState } from "react";
import UploadArea from "@/features/convert/components/UploadArea";
import { Canvas, Sidebar, Toolbar } from "@/features/editor/components";
import {
  DEFAULT_FILTERS,
  type Filters,
  buildCssFilter,
} from "@/features/editor/types";
import { removeBg } from "@/features/editor/api/removeBg";

type Step = {
  blob: Blob;
  filters: Filters;
};

export default function EditorPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);
  const [ptr, setPtr] = useState(-1);
  const current = ptr >= 0 ? steps[ptr] : null;

  const [busy, setBusy] = useState(false);
  const [draftFilters, setDraftFilters] = useState<Filters>(DEFAULT_FILTERS);

  const imageUrl = useMemo(
    () => (current ? URL.createObjectURL(current.blob) : null),
    [current]
  );

  const debounceRef = useRef<number | null>(null);

  const pushStep = useCallback(
    (blob: Blob, filters: Filters) => {
      setSteps((prev) => {
        const base = prev.slice(0, ptr + 1);
        return [...base, { blob, filters }];
      });
      setPtr((p) => p + 1);
      setDraftFilters(filters);
    },
    [ptr]
  );

  const onPickFile = useCallback(
    (file: File) => {
      pushStep(file, DEFAULT_FILTERS);
    },
    [pushStep]
  );

  const onUndo = () => {
    if (ptr <= 0) return;
    setPtr((p) => {
      const np = p - 1;
      setDraftFilters(steps[np].filters);
      return np;
    });
  };

  const onRedo = () => {
    if (ptr >= steps.length - 1) return;
    setPtr((p) => {
      const np = p + 1;
      setDraftFilters(steps[np].filters);
      return np;
    });
  };

  const pickOther = () => inputRef.current?.click();

  const handleFiltersChange = (nextFilters: Filters) => {
    setDraftFilters(nextFilters);
    if (!current) return;

    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    const baseBlob = current.blob;
    debounceRef.current = window.setTimeout(() => {
      pushStep(baseBlob, nextFilters);
    }, 300);
  };

  const onRemoveBg = async () => {
    if (!current) return;
    setBusy(true);
    try {
      const blob = await removeBg(current.blob);
      pushStep(blob, draftFilters);
    } finally {
      setBusy(false);
    }
  };

  const onDownload = async () => {
    if (!current) return;
    setBusy(true);
    try {
      const blob = current.blob;
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.src = url;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.filter = buildCssFilter(draftFilters);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((out) => {
        if (!out) return;
        const dlUrl = URL.createObjectURL(out);
        const a = document.createElement("a");
        a.href = dlUrl;
        a.download = "image.png";
        a.click();
        URL.revokeObjectURL(dlUrl);
      }, "image/png");

      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  };

  if (!current) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 sm:p-5">
          <ol className="space-y-2">
            {[
              { n: 1, t: "Dodaj zdjęcie" },
              { n: 2, t: "Użyj narzędzi po lewej (AI, kolory, filtry)" },
              { n: 3, t: "Pobierz efekt lub edytuj dalej" },
            ].map((s) => (
              <li
                key={s.n}
                className="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-indigo-500/15"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-sm text-indigo-300 group-hover:bg-indigo-500/30">
                  {s.n}
                </span>
                <span className="text-sm font-medium group-hover:text-indigo-200">
                  {s.t}
                </span>
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
          filters={draftFilters}
          setFilters={handleFiltersChange}
          onResetFilters={() => handleFiltersChange(DEFAULT_FILTERS)}
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

          <Canvas
            imageUrl={imageUrl}
            onPickFile={onPickFile}
            filters={draftFilters}
          />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPickFile(f);
          e.currentTarget.value = "";
        }}
      />
    </div>
  );
}
