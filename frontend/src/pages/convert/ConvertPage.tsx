import { useEffect, useState } from "react";
import UploadArea from "@/features/convert/components/FileCard/UploadArea";
import ActionBar from "@/features/convert/components/FileCard/ActionBar";
import FileCard from "@/features/convert/components/FileCard/FileCard";
import { useConversionState } from "@/features/convert/components/FileCard/useConversionState";
import { getSupportedFormats } from "@/features/convert/api";

export default function ConvertPage() {
  const s = useConversionState();

  const [availableFormats, setAvailableFormats] = useState<string[]>(["jpeg","png","webp"]);
  const [labelMap, setLabelMap] = useState<Record<string,string>>({ jpeg:"jpg", tiff:"tif" });

  useEffect(() => {
    getSupportedFormats()
      .then(({ formats, preferred_ext }) => {
        const popular = ["jpeg","png","webp"];
        const rest = formats.filter((f) => !popular.includes(f));
        setAvailableFormats([...popular, ...rest]);
        setLabelMap(preferred_ext || {});
      })
      .catch(() => {});
  }, []);

  if (s.files.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 sm:p-5">
          <ol className="space-y-2">
            {[{n:1,t:"Dodaj pliki"},{n:2,t:"Ustaw formaty"},{n:3,t:"Konwertuj"},{n:4,t:"Gotowe!"}].map((step) => (
              <li key={step.n} className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-indigo-500/15">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-sm text-indigo-300 group-hover:bg-indigo-500/30">{step.n}</span>
                <span className="text-sm font-medium group-hover:text-indigo-200">{step.t}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2 text-sm text-slate-300">
            Wskazówka: przeciągnij kilka plików naraz, a potem ustaw docelowe formaty zbiorczo.
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 p-5 bg-gradient-to-br from-indigo-500/10 via-slate-800/30 to-slate-900/40">
          <div className="rounded-2xl border-2 border-dashed border-white/15 p-8">
            <UploadArea onFiles={s.addFiles} />
          </div>
        </div>

        <div className="mt-2">
          <button onClick={s.openAddDialog} className="rounded-xl border border-white/10 bg-indigo-500 mt-3 px-3 py-2 text-white">
            Dodaj pliki
          </button>
        </div>

        <p className="pt-8 text-center text-slate-400">Brak plików do wyświetlenia.</p>

        <input ref={s.inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => s.addFiles(Array.from(e.target.files || []))}/>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="flex items-center justify-between bg-[rgba(255,255,255,0.04)] px-6 py-4">
          <button onClick={s.openAddDialog} className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-3 py-2 hover:bg-[rgba(255,255,255,0.1)]">
            + Dodaj
          </button>
          <div className="flex gap-2">
            <button onClick={s.clearAll} className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-3 py-2 hover:bg-[rgba(255,255,255,0.1)]">
              Usuń wszystkie
            </button>
          </div>
          <input ref={s.inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => s.addFiles(Array.from(e.target.files || []))}/>
        </div>

        <div className="border-t border-white/10 px-6 py-5 space-y-4">
          {s.files.map((f, i) => (
            <FileCard
              key={f.name + i}
              file={f}
              index={i}
              currentFormat={(s.formats[i] ?? "webp").toLowerCase()}
              onPickFormat={(fmt) => s.setFormats((p) => ({ ...p, [i]: fmt }))}
              quality={s.quality[i] ?? 85}
              onQuality={(v) => s.setQuality((p) => ({ ...p, [i]: v }))}
              onRemove={s.removeAt}
              availableFormats={availableFormats}
              labelMap={labelMap}
              
              size={s.sizes[i]}
              onSizeChange={(sz) => s.setSizes((p) => ({ ...p, [i]: sz }))}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        <ActionBar
          canStart={s.files.length > 0}
          canDownload={!!s.zipBlob}
          onStart={s.start}
          onDownload={s.download}
          busy={s.busy}
        />
      </div>
    </div>
  );
}
