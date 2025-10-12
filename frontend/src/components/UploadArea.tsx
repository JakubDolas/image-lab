import { useRef, useState } from "react";

interface UploadAreaProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function UploadArea({ setFiles }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsOver(false);
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) setFiles((prev) => [...prev, ...dropped]);
  }
  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(e.target.files || []);
    if (chosen.length) setFiles((prev) => [...prev, ...chosen]);
    e.target.value = "";
  }

  return (
    <div
      className={`text-center transition ${isOver ? "opacity-100" : "opacity-100"}`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className="mx-auto mt-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/10">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 9l5-5 5 5M12 4v12" />
        </svg>
      </div>
      <h2 className="mt-3 text-lg font-semibold">Przeciągnij i upuść pliki tutaj</h2>
      <p className="text-xs text-slate-300">Obsługiwane: .jpg .png .webp .gif .bmp .tiff</p>
      <button className="mt-4 mb-5 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15" type="button">
        Wybierz z dysku
      </button>
      <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={onSelect} />
    </div>
  );
}
