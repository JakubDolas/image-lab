import { useCallback, useMemo, useRef } from "react";
import type { DragEvent } from "react";
import type { Filters, CropRect } from "@/features/editor/types";
import { buildCssFilter } from "@/features/editor/types";
import { CropOverlay } from "./CropOverlay";

type Props = {
  imageUrl: string | null;
  onPickFile: (file: File) => void;
  filters: Filters;
  cropEnabled: boolean;
  cropRect: CropRect | null;
  onChangeCropRect: (rect: CropRect) => void;
};

export default function Canvas({
  imageUrl,
  onPickFile,
  filters,
  cropEnabled,
  cropRect,
  onChangeCropRect,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) onPickFile(f);
    },
    [onPickFile]
  );

  const cssFilter = useMemo(() => buildCssFilter(filters), [filters]);

  return (
    <div className="relative flex-1">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="relative h-[72vh] rounded-2xl border-2 border-dashed border-white/10 bg-black/20"
      >
        {imageUrl ? (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative inline-block max-h-[90vh] max-w-[90vw]">
              <img
                src={imageUrl}
                alt=""
                draggable={false}
                style={{ filter: cssFilter }}
                className="block max-h-[72vh] max-w-[72vw] rounded-lg object-contain"
              />

              {cropEnabled && (
                <CropOverlay
                  rect={cropRect}
                  onChange={onChangeCropRect}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-slate-400">
            Przeciągnij obraz tutaj albo{" "}
            <button
              className="text-indigo-300 underline underline-offset-2"
              onClick={() => inputRef.current?.click()}
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
