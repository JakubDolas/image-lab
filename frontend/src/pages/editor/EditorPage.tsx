import { useRef, useState } from "react";
import Canvas, { type CanvasHandle } from "@/features/editor/components/canvas/Canvas";
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
      drawingMode,
      brushSize,
      brushColor,
      historyItems,
      colorSpace
    },
    actions: {
      setFilters,
      resetFilters,
      saveFilterState,
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
      setDrawingMode,
      setBrushSize,
      setBrushColor,
      onApplyDrawing,
    },
  } = useEditor();

  const [downloadOpen, setDownloadOpen] = useState(false);
  const [dlFormat, setDlFormat] = useState("png");
  const [dlQuality, setDlQuality] = useState(90);

  const canvasRef = useRef<CanvasHandle | null>(null);

  if (!current) {
    return <EditorEmptyState onPickFile={onPickFile} />;
  }

  const handleSetDraw = () => {
    setDrawingMode("draw");
  };

  const handleSetErase = () => {
    setDrawingMode("erase");
  };

  const handleApplyDrawingClick = () => {
    canvasRef.current?.applyDrawing();
    setDrawingMode("off");
  };

  const handleCancelDrawingClick = () => {
    canvasRef.current?.cancelDrawing?.();
    setDrawingMode("off");
  };

  const isModeActive = cropEnabled || drawingMode !== "off";

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
          onSaveHistory={saveFilterState}
          onResetFilters={resetFilters}
          cropEnabled={cropEnabled}
          onStartCrop={handleStartCrop}
          onApplyCrop={handleApplyCrop}
          onCancelCrop={handleCancelCrop}
          drawingMode={drawingMode}
          brushSize={brushSize}
          brushColor={brushColor}
          onSetDraw={handleSetDraw}
          onSetErase={handleSetErase}
          onChangeBrushSize={setBrushSize}
          onChangeBrushColor={setBrushColor}
          onApplyDrawingClick={handleApplyDrawingClick}
          onCancelDrawingClick={handleCancelDrawingClick}
          historyItems={historyItems}
          imageInfo={
            imageSize && current
              ? {
                  width: imageSize.width,
                  height: imageSize.height,
                  format:
                    current.blob.type === "image/jpeg"
                      ? "JPG"
                      : current.blob.type === "image/png"
                      ? "PNG"
                      : "Obraz",
                  sizeBytes: current.blob.size,
                  colorSpace: colorSpace,
                }
              : null
          }
        />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Toolbar
            busy={busy || isModeActive}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={onUndo}
            onRedo={onRedo}
            onPickOther={pickOther}
            onOpenDownload={() => setDownloadOpen(true)}
            imageSize={imageSize}
          />

          <Canvas
            ref={canvasRef}
            imageUrl={imageUrl}
            onPickFile={onPickFile}
            filters={filters}
            cropEnabled={cropEnabled}
            cropRect={cropRect}
            onChangeCropRect={setCropRect}
            busy={busy}
            drawingMode={drawingMode}
            brushSize={brushSize}
            brushColor={brushColor}
            onApplyDrawing={onApplyDrawing}
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