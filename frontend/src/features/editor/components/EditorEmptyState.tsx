import UploadArea from "@/features/convert/components/UploadArea";

type Props = {
  onPickFile: (file: File) => void;
};

export function EditorEmptyState({ onPickFile }: Props) {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 sm:p-5">
        <ol className="space-y-2">
          {[
            { n: 1, t: "Dodaj zdjęcie" },
            { n: 2, t: "Użyj narzędzi po lewej (AI, kolory, kadrowanie)" },
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
