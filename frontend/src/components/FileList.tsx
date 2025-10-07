import { useEffect, useState } from "react";

interface FileListProps {
  files: File[];
  onAddMore: () => void;
  onRemove: (index: number) => void;
}

function extOf(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;
  const t = file.type;
  return t.startsWith("image/") ? t.replace("image/", "") : "unknown";
}

function Thumb({ file }: { file: File }) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  return (
    <img
      src={url}
      alt={file.name}
      className="w-12 h-12 object-cover rounded-md border"
    />
  );
}

export default function FileList({ files, onAddMore, onRemove }: FileListProps) {
  return (
    <div className="bg-white border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onAddMore}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white"
          title="Dodaj"
        >
          +
        </button>
        <span className="text-orange-600 font-medium">Dodaj</span>
      </div>

      <div className="divide-y">
        {files.map((f, i) => (
          <div key={i} className="py-3">
            <div className="flex items-center gap-3">
              <Thumb file={f} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-gray-800">{f.name}</div>
                <div className="text-xs text-gray-500">format: {extOf(f)}</div>
              </div>
              <button
                onClick={() => onRemove(i)}
                className="text-xs text-red-600 hover:underline"
              >
                usuń
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
