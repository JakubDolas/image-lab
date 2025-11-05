import { useEffect, useMemo, useState } from "react";
import Toolbar from "@/features/editor/components/Toolbar";
import Canvas from "@/features/editor/components/Canvas";
import { removeBg } from "@/features/editor/api/removeBg";

export default function EditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pickFile = (f: File) => {
    setFile(f);
    const u = URL.createObjectURL(f);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return u;
    });
  };

  const canApply = useMemo(() => !!file && !busy, [file, busy]);

  const onRemoveBg = async () => {
    if (!file) return;
    try {
      setBusy(true);
      const blob = await removeBg(file);
      const resultUrl = URL.createObjectURL(blob);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return resultUrl;
      });

      const outFile = new File([blob], file.name.replace(/\.[^.]+$/, "") + "_no-bg.png", {
        type: "image/png",
      });
      setFile(outFile);
    } catch (e) {
      console.error(e);
      alert("Nie udało się usunąć tła.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="mx-auto max-w-[1400px] p-4">
      <div className="flex min-h-[75vh] overflow-hidden rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)]">
        <Toolbar onRemoveBg={onRemoveBg} canApply={canApply} busy={busy} />
        <Canvas imageUrl={previewUrl} onPickFile={pickFile} />
      </div>
    </div>
  );
}
