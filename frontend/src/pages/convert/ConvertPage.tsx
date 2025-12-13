import ActionBar from "@/features/convert/components/ActionBar";
import FileCard from "@/features/convert/components/FileCard/FileCard";
import { useConversionState } from "@/features/convert/components/hooks/useConversionState";
import { useFormats } from "@/features/convert/components/hooks/useFormats";
import { ConvertEmptyState } from "@/features/convert/components/ConvertEmptyState";
import { ConvertToolbar } from "@/features/convert/components/ConvertToolbar";

export default function ConvertPage() {
  const s = useConversionState();
  const { availableFormats, labelMap } = useFormats();

  if (s.files.length === 0) {
    return (
      <ConvertEmptyState
        addFiles={s.addFiles}
        openAddDialog={s.openAddDialog}
        inputRef={s.inputRef}
        error={s.error}
      />
    );
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <ConvertToolbar
          openAddDialog={s.openAddDialog}
          clearAll={s.clearAll}
          inputRef={s.inputRef}
          addFiles={s.addFiles}
        />

        <div className="border-t border-white/10 px-6 py-5 space-y-4">
          { s.files.map((entry, i) => (
          <FileCard
            key={entry.file.name + i}
            file={entry.file}
            previewBlob={entry.previewBlob}
            index={i}
            currentFormat={(s.formats[i] ?? "webp").toLowerCase()}
            onPickFormat={(fmt) =>
              s.setFormats((p) => ({ ...p, [i]: fmt }))
            }
            quality={s.quality[i] ?? 85}
            onQuality={(v) =>
              s.setQuality((p) => ({ ...p, [i]: v }))
            }
            onRemove={s.removeAt}
            availableFormats={availableFormats}
            labelMap={labelMap}
            size={s.sizes[i]}
            onSizeChange={(sz) =>
              s.setSizes((p) => ({ ...p, [i]: sz }))
            }
          />
        ))}
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        <ActionBar
          canStart={s.files.length > 0}
          canDownload={!!s.zipBlob}
          onStart={s.start}
          onDownload={s.download}
          busy={s.busy}
        />
      </div>
    </div>
  );
}
