import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Fmt = "jpg" | "png" | "webp";

interface FileListProps {
  files: File[];
  formats: Record<number, Fmt>;
  setFormats: React.Dispatch<React.SetStateAction<Record<number, Fmt>>>;
  quality: Record<number, number>;
  setQuality: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  onRemove: (index: number) => void;
}

const formatBytes = (b: number) => {
  if (!b) return "0 B";
  const k = 1024, sizes = ["B","KB","MB","GB"];
  const i = Math.floor(Math.log(b)/Math.log(k));
  return `${(b/Math.pow(k,i)).toFixed(1)} ${sizes[i]}`;
};
const extOf = (file: File) => file.name.split(".").pop()?.toLowerCase() ?? "unknown";

function Thumb({ file }: { file: File }) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return (
    <div className="w-14 h-14 rounded-xl border border-white/10 overflow-hidden bg-black/30">
      <img src={url} className="w-full h-full object-cover" />
    </div>
  );
}

export default function FileList({
  files, formats, setFormats, quality, setQuality, onRemove,
}: FileListProps) {
  useEffect(() => {
    setFormats((prev) => {
      const copy = { ...prev };
      files.forEach((_, i) => { if (!copy[i]) copy[i] = "webp"; });
      return copy;
    });
    setQuality((prev) => {
      const copy = { ...prev };
      files.forEach((_, i) => { if (copy[i] == null) copy[i] = 85; });
      return copy;
    });
  }, [files, setFormats, setQuality]);

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {files.map((f, i) => {
          const fmt = formats[i] ?? "webp";
          const lossy = fmt !== "png";
          const q = quality[i] ?? 85;

          return (
            <motion.div
              key={f.name + i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4"
            >
              <div className="flex items-center gap-4">
                <Thumb file={f} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px]">{f.name}</div>
                  <div className="text-xs text-slate-400">
                    format: {extOf(f)} • {formatBytes(f.size)}
                  </div>
                </div>

                <div className="hidden md:block text-sm text-slate-300 mr-2">
                  Gotowy do konwersji
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onRemove(i)}
                  className="px-3 py-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] text-rose-300 hover:bg-[rgba(255,255,255,0.1)]"
                >
                  Usuń
                </motion.button>
              </div>

              <div className="my-4 h-px bg-white/10" />

              <div className="grid grid-cols-1 md:grid-cols-[210px,1fr,70px] items-center gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-300 shrink-0">Format</label>
                  <select
                    value={fmt.toUpperCase()}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase() as Fmt;
                      setFormats((prev) => ({ ...prev, [i]: value }));
                    }}
                    className="px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.06)] border border-white/10 text-sm"
                  >
                    <option value="WEBP">WEBP</option>
                    <option value="JPG">JPG</option>
                    <option value="PNG">PNG</option>
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm text-slate-300 shrink-0">Jakość</label>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    disabled={!lossy}
                    value={q}
                    onChange={(e) => setQuality((prev) => ({ ...prev, [i]: Number(e.target.value) }))}
                    className={`w-full ${lossy ? "accent-indigo-500" : "opacity-50 cursor-not-allowed"}`}
                  />
                </div>

                <div className="text-right text-sm tabular-nums">{q}</div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
