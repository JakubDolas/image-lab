import { useRef, useState } from "react";

interface Props { onFiles: (files: File[]) => void; }

export default function UploadArea({ onFiles }: Props) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [over, setOver] = useState(false);

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault(); setOver(false);
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) onFiles(dropped);
  }
  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(e.target.files || []);
    if (chosen.length) onFiles(chosen);
    e.target.value = "";
  }

  return (
    <div
      className={`text-center transition ${over ? "opacity-100" : "opacity-100"}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      onClick={() => ref.current?.click()}
    >
      <div className="mx-auto mt-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/10">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 9l5-5 5 5M12 4v12" />
        </svg>
      </div>
      <h2 className="mt-3 text-lg font-semibold">Przeciągnij i upuść pliki tutaj</h2>
      <p className="text-xs text-slate-300">Obsługiwane: .jpg .png .webp .gif .bmp .tiff i inne</p>
      <button className="mt-4 mb-5 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15" type="button">
        Wybierz z dysku
      </button>
      <input ref={ref} type="file" multiple className="hidden" onChange={onSelect}/>
    </div>
  );
}
