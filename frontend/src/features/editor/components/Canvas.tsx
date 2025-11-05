import { useCallback, useRef } from "react";

type Props = {
  imageUrl: string | null;
  onPickFile: (file: File) => void;
};

export default function Canvas({ imageUrl, onPickFile }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) onPickFile(f);
    },
    [onPickFile]
  );

  return (
    <div className="flex-1 p-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="relative flex h-[70vh] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/20"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="max-h-full max-w-full select-none rounded-lg object-contain"
            draggable={false}
          />
        ) : (
          <div className="text-sm text-slate-400">
            Przeciągnij obraz tutaj albo{" "}
            <button
              onClick={() => inputRef.current?.click()}
              className="text-indigo-300 underline underline-offset-2"
              type="button"
            >
              wybierz z dysku
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPickFile(f);
          }}
        />
      </div>
    </div>
  );
}
