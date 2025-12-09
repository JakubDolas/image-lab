import Range from "@/features/editor/ui/Range";
import type { Filters } from "@/features/editor/types";
import SectionShell from "./SectionShell";

type Props = {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onSaveHistory: () => void;
  onResetFilters: () => void;
  openIds: Set<string>;
  toggle: (id: string) => void;
};

export default function EffectsSection({
  filters,
  setFilters,
  onSaveHistory,
  onResetFilters,
  openIds,
  toggle,
}: Props) {
  const set = <K extends keyof Filters>(key: K, value: number) =>
    setFilters({ ...filters, [key]: value });

  return (
    <SectionShell
      id="effects"
      title="Efekty"
      openIds={openIds}
      toggle={toggle}
    >
      <div 
        className="space-y-3"
        onPointerUp={onSaveHistory} 
        onTouchEnd={onSaveHistory}
      >
        <Range
          label="Sepia"
          min={0}
          max={100}
          value={filters.sepia}
          onChange={(v) => set("sepia", v)}
        />
        <Range
          label="Czarno-białe"
          min={0}
          max={100}
          value={filters.grayscale}
          onChange={(v) => set("grayscale", v)}
        />
        <Range
          label="Negatyw"
          min={0}
          max={100}
          value={filters.invert}
          onChange={(v) => set("invert", v)}
        />
        <Range
          label="Rozmycie"
          min={0}
          max={20}
          value={filters.blur}
          onChange={(v) => set("blur", v)}
          unit="px"
        />

        <div className="pt-1">
          <button
            type="button"
            className="h-9 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm hover:bg-white/15"
            onClick={onResetFilters}
          >
            Resetuj kolory i filtry
          </button>
        </div>
      </div>
    </SectionShell>
  );
}