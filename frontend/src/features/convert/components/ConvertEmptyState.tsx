import type { RefObject } from "react";
import UploadArea from "@/features/convert/components/UploadArea";
import { ErrorAlert } from "@/features/convert/components/ErrorAlert";

type Props = {
  addFiles: (files: File[]) => void;
  openAddDialog: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  error: string | null;
};

export function ConvertEmptyState({ addFiles, openAddDialog, inputRef, error }: Props) {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">

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
          <UploadArea onFiles={addFiles} />
        </div>
      </div>

      <ErrorAlert message={error} />

      <p className="pt-8 text-center text-slate-400">Brak plików do wyświetlenia.</p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
      />
    </div>
  );
}
