import ModalShell from "./ModalShell";
import PreviewCanvas from "./PreviewCanvas";
import ControlsPanel from "./ControlsPanel/ControlsPanel";
import { useResizeState } from "./hooks/useResizeState";
import type { ResizeModalProps } from "./types";

export default function ResizeModal(props: ResizeModalProps) {
  const s = useResizeState(props);

  return (
    <ModalShell open width="min(96vw,1300px)" onClose={s.onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <h3 className="text-slate-300 text-base font-semibold">Zmień rozmiar</h3>
        <button onClick={s.onClose} className="px-2 py-1 text-white rounded hover:bg-white/10">✕</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-4 p-4">
        <PreviewCanvas
          url={s.url}
          keepAspect={s.keepAspect}
          boxRef={s.boxRef}
          preview={s.preview}
          onStartResize={s.startResize}
          onRefit={s.refit}
        />

        <ControlsPanel
          nat={s.nat}
          w={s.preview.dw}
          h={s.preview.dh}
          keepAspect={s.keepAspect}
          limitToOrig={s.limitToOrig}
          onChangeW={s.changeW}
          onChangeH={s.changeH}
          setKeepAspect={s.setKeepAspect}
          setLimitToOrig={s.setLimitToOrig}
          onPickSize={s.setExactSize}
          onApply={s.apply}
          onClose={s.onClose}
        />
      </div>
    </ModalShell>
  );
}
