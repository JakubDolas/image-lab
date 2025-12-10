import { useState } from "react";
import { motion } from "framer-motion";
import Thumb from "./Thumb";
import QualitySlider from "./QualitySlider";
import FormatGrid from "./FormatGrid";
import ResizeModal from "@/features/convert/components/ResizeModal";

import { formatBytes } from "@/features/convert/components/lib/bytes";

function extOf(file: File) {
  return file.name.split(".").pop()?.toLowerCase() ?? "unknown";
}

interface Props {
  file: File;
  previewBlob: File | Blob;
  index: number;
  currentFormat: string;
  onPickFormat: (fmt: string) => void;
  quality: number;
  onQuality: (v: number) => void;
  onRemove: (index: number) => void;
  availableFormats: string[];
  labelMap: Record<string, string>;
  size?: { width: number | null; height: number | null };
  onSizeChange?: (size: { width: number | null; height: number | null }) => void;
}

export default function FileCard({
  file,
  previewBlob,
  index,
  currentFormat,
  onPickFormat,
  quality,
  onQuality,
  onRemove,
  availableFormats,
  labelMap,
  size,
  onSizeChange,
}: Props) {
  const lossy = currentFormat === "jpeg" || currentFormat === "webp";
  const [resizeOpen, setResizeOpen] = useState(false);
  const applied = Boolean(size && (size.width || size.height));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4"
    >
      <div className="flex items-center gap-4">
        <Thumb file={previewBlob as File} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px]">{file.name}</div>
          <div className="text-xs text-slate-400">
            format: {extOf(file)} • {formatBytes(file.size)}
          </div>

          {applied && (
            <div className="mt-1 text-xs text-indigo-300">
              Zmieniony rozmiar:{" "}
              <b>
                {size?.width ?? "—"} × {size?.height ?? "—"} px
              </b>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm text-slate-300 mr-2">
          <button
            onClick={() => setResizeOpen(true)}
            className="px-3 py-2 rounded-xl border border-white/10 bg-white/10 hover:bg-white/15"
            type="button"
          >
            Zmień rozmiar
          </button>
          <span className="opacity-70">|</span>
          <span>Gotowy do konwersji</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onRemove(index)}
          className="px-3 py-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] text-rose-300 hover:bg-[rgba(255,255,255,0.1)]"
          type="button"
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

      {resizeOpen && (
        <ResizeModal
          file={previewBlob}
          initialWidth={size?.width ?? undefined}
          initialHeight={size?.height ?? undefined}
          keepAspectDefault={true}
          limitToOriginalDefault={false}
          onApply={({ width, height }) => {
            onSizeChange?.({ width, height });
            setResizeOpen(false);
          }}
          onClose={() => setResizeOpen(false)}
        />
      )}


    </motion.div>
  );
}
