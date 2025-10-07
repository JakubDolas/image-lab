import { useRef, useState } from "react";
import UploadArea from "../src/components/UploadArea";
import FileList from "../src/components/FileList";
import FormatPicker from "../src/components/FormatPicker";
import ActionBar from "../src/components/ActionBar";
import { convertZipSimple } from "../src/api";

export default function Convert() {
  const [files, setFiles] = useState<File[]>([]);
  const [target, setTarget] = useState("");
  const [busy, setBusy] = useState(false);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  async function start() {
    if (!files.length) return;
    setBusy(true);
    try {
      const blob = await convertZipSimple(files, target);
      setZipBlob(blob);
      download();
    } catch (e: any) {
      alert("Błąd konwersji: " + (e?.response?.data?.detail || e.message));
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!zipBlob) return;
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  function removeAt(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  function openAddDialog() {
    hiddenInputRef.current?.click();
  }

  function onHiddenSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(e.target.files || []);
    if (chosen.length) setFiles((prev) => [...prev, ...chosen]);
    e.target.value = "";
  }

  // upload
  if (files.length === 0) {
    return (
        <div className="px-4 py-8">
        <UploadArea files={files} setFiles={setFiles} />
        </div>
    );
    }

  // lista + wybór formatu + akcje
    return (
    <div className="space-y-6">
        <FileList files={files} onAddMore={openAddDialog} onRemove={removeAt} />

        <div className="bg-white border rounded-2xl p-4 shadow-sm">
        <div className="mb-2 text-sm text-gray-600">Konwertuj na:</div>
        <FormatPicker target={target} setTarget={setTarget} />
        </div>

        <ActionBar
        canStart={files.length > 0}
        onStart={start}
        onDownload={download}
        busy={busy}
        />

        <input
        ref={hiddenInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={onHiddenSelect}
        />
    </div>
    );
}
