import Canvas from "@/features/editor/components/canvas/Canvas";
import Sidebar from "@/features/editor/components/sidebar/Sidebar";
import Toolbar from "@/features/editor/components/toolbar/Toolbar";
import { EditorEmptyState } from "@/features/editor/components/EditorEmptyState";
import { useEditor } from "@/features/editor/hooks/useEditor";

export default function EditorPage() {
  const {
    ref: { inputRef },
    state: {
      current,
      imageUrl,
      busy,
      filters,
      cropEnabled,
      cropRect,
      canUndo,
      canRedo,
      imageSize,
    },
    actions: {
      setFilters,
      resetFilters,
      onPickFile,
      onUndo,
      onRedo,
      pickOther,
      onRemoveBg,
      onUpscale,
      handleStartCrop,
      handleCancelCrop,
      handleApplyCrop,
      onDownload,
      setCropRect,
    },
  } = useEditor();

  if (!current) {
    return <EditorEmptyState onPickFile={onPickFile} />;
  }

  return (
    <div className="mx-auto max-w-[1300px]">
      <div className="flex gap-4">
        <Sidebar
          busy={busy}
          onRemoveBg={onRemoveBg}
          onUpscale={onUpscale}
          onPickOther={pickOther}
          filters={filters}
          setFilters={setFilters}
          onResetFilters={resetFilters}
          cropEnabled={cropEnabled}
          onStartCrop={handleStartCrop}
          onApplyCrop={handleApplyCrop}
          onCancelCrop={handleCancelCrop}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Toolbar
            busy={busy}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={onUndo}
            onRedo={onRedo}
            onPickOther={pickOther}
            onDownload={onDownload}
            imageSize={imageSize}
          />

          <Canvas
            imageUrl={imageUrl}
            onPickFile={onPickFile}
            filters={filters}
            cropEnabled={cropEnabled}
            cropRect={cropRect}
            onChangeCropRect={setCropRect}
            busy={busy}
          />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPickFile(f);
          e.currentTarget.value = "";
        }}
      />
    </div>
  );
}
