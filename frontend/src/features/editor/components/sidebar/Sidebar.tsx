import { useState } from "react";
import type { Filters } from "@/features/editor/types";

import AiSection from "./AiSection";
import ColorSection from "./ColorSection";
import EffectsSection from "./EffectsSection";
import CropSection from "./CropSection";
import SectionShell from "./SectionShell";

type Props = {
  busy: boolean;
  onRemoveBg: () => void;
  onUpscale: () => void;

  onPickOther: () => void;

  filters: Filters;
  setFilters: (f: Filters) => void;
  onResetFilters: () => void;

  cropEnabled: boolean;
  onStartCrop: () => void;
  onApplyCrop: () => void;
  onCancelCrop: () => void;
};

export default function Sidebar({
  busy,
  onRemoveBg,
  onUpscale,
  onPickOther,
  filters,
  setFilters,
  onResetFilters,
  cropEnabled,
  onStartCrop,
  onApplyCrop,
  onCancelCrop,
}: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <aside
      className="
        w-[260px] h-[77vh] flex-shrink-0 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-3 overflow-y-auto pr-1 nice-scrollbar">
      <div className="px-2 pb-2 text-[11px] uppercase tracking-wider text-slate-400">
        Narzędzia
      </div>

      <div className="flex flex-col gap-2">
        <AiSection
          busy={busy}
          onRemoveBg={onRemoveBg}
          onUpscale={onUpscale}
          openIds={openIds}
          toggle={toggle}
        />

        <ColorSection
          filters={filters}
          setFilters={setFilters}
          onResetFilters={onResetFilters}
          openIds={openIds}
          toggle={toggle}
        />

        <EffectsSection
          filters={filters}
          setFilters={setFilters}
          onResetFilters={onResetFilters}
          openIds={openIds}
          toggle={toggle}
        />

        <CropSection
          busy={busy}
          cropEnabled={cropEnabled}
          onStartCrop={onStartCrop}
          onApplyCrop={onApplyCrop}
          onCancelCrop={onCancelCrop}
          openIds={openIds}
          toggle={toggle}
        />

        <SectionShell id="file" title="Plik" openIds={openIds} toggle={toggle}>
          <button
            type="button"
            onClick={onPickOther}
            className="h-9 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm hover:bg-white/15"
          >
            Wybierz inne zdjęcie
          </button>
        </SectionShell>
      </div>
    </aside>
  );
}
