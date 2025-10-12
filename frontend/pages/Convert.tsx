import { useRef, useState, useEffect } from "react";
import { convertZipCustom, type FileOption } from "../src/api";
import UploadArea from "../src/components/UploadArea";
import FileList from "../src/components/FileList";
import ActionBar from "../src/components/ActionBar";

type Fmt = "jpg" | "png" | "webp";

export default function Convert() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const [formats, setFormats] = useState<Record<number, Fmt>>({});
  const [quality, setQuality] = useState<Record<number, number>>({});

  useEffect(() => {
    setFormats((prev) => {
      const copy = { ...prev };
      files.forEach((_, i) => {
        if (!copy[i]) copy[i] = "webp";
      });
      return copy;
    });
    setQuality((prev) => {
      const copy = { ...prev };
      files.forEach((_, i) => {
        if (copy[i] == null) copy[i] = 85;
      });
      return copy;
    });
  }, [files]);

  function openAddDialog() {
    hiddenInputRef.current?.click();
  }

  function onHiddenSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(e.target.files || []);
    if (chosen.length) setFiles((prev) => [...prev, ...chosen]);
    e.target.value = "";
  }

  function clearAll() {
    setFiles([]);
    setFormats({});
    setQuality({});
    setZipBlob(null);
  }

  function removeAt(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

    setFormats((prev) => {
      const copy = { ...prev };
      delete copy[i];
      const shifted: Record<number, Fmt> = {};
      Object.keys(copy).forEach((k) => {
        const idx = Number(k);
        shifted[idx < i ? idx : idx - 1] = copy[idx];
      });
      return shifted;
    });

    setQuality((prev) => {
      const copy = { ...prev };
      delete copy[i];
      const shifted: Record<number, number> = {};
      Object.keys(copy).forEach((k) => {
        const idx = Number(k);
        shifted[idx < i ? idx : idx - 1] = copy[idx];
      });
      return shifted;
    });
  }

  async function start() {
    if (!files.length) return;
    setBusy(true);
    try {
      const opts: FileOption[] = files.map((_, i) => {
        const fmt = formats[i] ?? "webp";
        return {
          width: null,
          height: null,
          quality: fmt === "png" ? null : (quality[i] ?? 85),
          format: fmt,
        };
      });
      setZipBlob(null);
      const blob = await convertZipCustom(files, opts);
      setZipBlob(blob);
    } catch (e: any) {
      alert("Błąd konwersji: " + (e?.response?.data?.detail || e.message));
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!zipBlob) return alert("Najpierw kliknij „Konwertuj wszystko”.");
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (files.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-6 ">
        <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 sm:p-5">
          <ol className="space-y-2">
            {[
              { n: 1, t: "Dodaj pliki" },
              { n: 2, t: "Ustaw formaty" },
              { n: 3, t: "Konwertuj" },
              { n: 4, t: "Gotowe!" },
            ].map((step) => (
              <li
                key={step.n}
                className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-indigo-500/15"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-sm text-indigo-300 group-hover:bg-indigo-500/30">
                  {step.n}
                </span>
                <span className="text-sm font-medium group-hover:text-indigo-200">
                  {step.t}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-4 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2 text-sm text-slate-300">
            Wskazówka: przeciągnij kilka plików naraz, a potem ustaw docelowe formaty zbiorczo.
          </div>

        </div>
        
        <div className="rounded-2xl border border-white/10 p-5 bg-gradient-to-br from-indigo-500/10 via-slate-800/30 to-slate-900/40">
          <div className="rounded-2xl border-2 border-dashed border-white/15 p-8">
            <UploadArea files={files} setFiles={setFiles} />
          </div>
        </div>

        <div className="mt-2 flex gap-3">
          <button bg-indigo-500
            onClick={openAddDialog}
            className="rounded-xl border border-white/10 bg-indigo-500 mt-3 px-3 py-2 "
          >
            Dodaj pliki
          </button>
        </div>

        <p className="pt-8 text-center text-slate-400">Brak plików do wyświetlenia.</p>

        <input
          ref={hiddenInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={onHiddenSelect}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="flex items-center justify-between bg-[rgba(255,255,255,0.04)] px-6 py-4">
          <button
            onClick={openAddDialog}
            className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-3 py-2 hover:bg-[rgba(255,255,255,0.1)]"
          >
            + Dodaj
          </button>

          <div className="flex gap-2">
            <button
              onClick={clearAll}
              className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-3 py-2 hover:bg-[rgba(255,255,255,0.1)]"
            >
              Usuń wszystkie
            </button>
          </div>

          <input
            ref={hiddenInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={onHiddenSelect}
          />
        </div>

        <div className="border-t border-white/10 px-6 py-5">
          <FileList
            files={files}
            formats={formats}
            setFormats={setFormats}
            quality={quality}
            setQuality={setQuality}
            onRemove={removeAt}
          />
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        <ActionBar
          canStart={files.length > 0}
          canDownload={!!zipBlob}
          onStart={start}
          onDownload={download}
          busy={busy}
        />
      </div>
    </div>
  );
}
