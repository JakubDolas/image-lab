import { motion } from "framer-motion";
import Thumb from "./Thumb";
import QualitySlider from "./QualitySlider";
import FormatGrid from "./FormatGrid";
import { formatBytes } from "@/shared/lib/bytes";

function extOf(file: File) {
  return file.name.split(".").pop()?.toLowerCase() ?? "unknown";
}

interface Props {
  file: File;
  index: number;
  currentFormat: string;
  onPickFormat: (fmt: string) => void;
  quality: number;
  onQuality: (v: number) => void;
  onRemove: (index: number) => void;
  availableFormats: string[];
  labelMap: Record<string, string>;
}

export default function FileCard({
  file, index, currentFormat, onPickFormat, quality, onQuality, onRemove, availableFormats, labelMap,
}: Props) {
  const lossy = currentFormat === "jpeg" || currentFormat === "webp";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4"
    >
      <div className="flex items-center gap-4">
        <Thumb file={file} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px]">{file.name}</div>
          <div className="text-xs text-slate-400">format: {extOf(file)} • {formatBytes(file.size)}</div>
        </div>
        <div className="hidden md:block text-sm text-slate-300 mr-2">Gotowy do konwersji</div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onRemove(index)}
          className="px-3 py-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] text-rose-300 hover:bg-[rgba(255,255,255,0.1)]"
        >
          Usuń
        </motion.button>
      </div>

      <div className="my-4 h-px bg-white/10" />

      <QualitySlider value={quality} onChange={onQuality} enabled={lossy} />

      <div className="mt-6">
        <FormatGrid
          current={currentFormat}
          onPick={onPickFormat}
          availableFormats={availableFormats}
          labelMap={labelMap}
        />
      </div>
    </motion.div>
  );
}
