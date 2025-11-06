import { useCallback, useRef } from "react";

export default function Canvas({
  imageUrl, onPickFile,
}: { imageUrl: string | null; onPickFile: (file: File) => void; }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onPickFile(f);
  }, [onPickFile]);

  return (
    <div className="relative flex-1">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="relative h-[72vh] rounded-2xl border-2 border-dashed border-white/10 bg-black/20"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            draggable={false}
            className="absolute left-1/2 top-1/2 max-h-[90%] max-w-[90%] -translate-x-1/2 -translate-y-1/2 select-none rounded-lg object-contain"
          />
        ) : (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-slate-400">
            Przeciągnij obraz tutaj albo{" "}
            <button className="text-indigo-300 underline underline-offset-2"
              onClick={() => inputRef.current?.click()} type="button">
              wybierz z dysku
            </button>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickFile(f); }} />
      </div>
    </div>
  );
}
