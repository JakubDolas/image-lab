import { AnimatePresence, motion } from "framer-motion";
import SectionShell from "./SectionShell";

type Props = {
  busy: boolean;
  cropEnabled: boolean;
  onStartCrop: () => void;
  onApplyCrop: () => void;
  onCancelCrop: () => void;
  openIds: Set<string>;
  toggle: (id: string) => void;
};

export default function CropSection({
  busy,
  cropEnabled,
  onStartCrop,
  onApplyCrop,
  onCancelCrop,
  openIds,
  toggle,
}: Props) {
  return (
    <SectionShell
      id="crop"
      title="Kadrowanie"
      openIds={openIds}
      toggle={toggle}
    >
      {!cropEnabled && (
        <button
          type="button"
          className="h-9 w-full rounded-xl bg-indigo-600 px-3 text-sm text-white hover:brightness-110 disabled:opacity-50"
          onClick={onStartCrop}
          disabled={busy}
        >
          Przytnij
        </button>
      )}

      <AnimatePresence>
        {cropEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center justify-between gap-3"
          >
            <span className="text-xs text-slate-300">
              Przeciągnij ramkę na zdjęciu
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancelCrop}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-red-500/30"
                disabled={busy}
                aria-label="Anuluj kadrowanie"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={onApplyCrop}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white hover:brightness-110 disabled:opacity-50"
                disabled={busy}
                aria-label="Zastosuj kadrowanie"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}
