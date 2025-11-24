import { useState } from "react";
import Canvas from "@/features/editor/components/canvas/Canvas";
import Sidebar from "@/features/editor/components/sidebar/Sidebar";
import Toolbar from "@/features/editor/components/toolbar/Toolbar";
import DownloadModal from "@/features/editor/components/toolbar/DownloadModal";
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

  const [downloadOpen, setDownloadOpen] = useState(false);
  const [dlFormat, setDlFormat] = useState("png");
  const [dlQuality, setDlQuality] = useState(90);

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
            onOpenDownload={() => setDownloadOpen(true)}
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

      <DownloadModal
        open={downloadOpen}
        valueFormat={dlFormat}
        valueQuality={dlQuality}
        onChangeFormat={setDlFormat}
        onChangeQuality={setDlQuality}
        onCancel={() => setDownloadOpen(false)}
        onConfirm={() => {
          onDownload(dlFormat, dlQuality);
          setDownloadOpen(false);
        }}
      />
    </div>
  );
}
