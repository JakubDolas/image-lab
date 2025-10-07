import { useRef, useState } from "react";

interface UploadAreaProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function UploadArea({ files, setFiles }: UploadAreaProps) {
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
      className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-gray-500 transition ${
        isOver ? "bg-gray-50 border-blue-400" : "border-gray-300"
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={onDrop}
    >
      <div className="mb-3">Przeciągnij i upuść tutaj</div>
      <button
        className="px-5 py-3 rounded-full bg-blue-500 text-white hover:opacity-90"
        onClick={() => inputRef.current?.click()}
      >
        Dodaj pliki
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={onSelect}
      />
    </div>
  );
}
