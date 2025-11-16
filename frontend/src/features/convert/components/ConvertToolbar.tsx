import type { RefObject } from "react";

type Props = {
  openAddDialog: () => void;
  clearAll: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  addFiles: (files: File[]) => void;
};

export function ConvertToolbar({
  openAddDialog,
  clearAll,
  inputRef,
  addFiles,
}: Props) {
  return (
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
