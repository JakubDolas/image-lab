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

export default function ColorSection({
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
      id="colors"
      title="Kolory"
      openIds={openIds}
      toggle={toggle}
    >
      <div 
        className="space-y-3"
        onPointerUp={onSaveHistory} 
        onTouchEnd={onSaveHistory}
      >
        <Range
          label="Jasność"
          min={0}
          max={200}
          value={filters.brightness}
          onChange={(v) => set("brightness", v)}
        />
        <Range
          label="Kontrast"
          min={0}
          max={200}
          value={filters.contrast}
          onChange={(v) => set("contrast", v)}
        />
        <Range
          label="Nasycenie"
          min={0}
          max={300}
          value={filters.saturate}
          onChange={(v) => set("saturate", v)}
        />
        <Range
          label="Odcień (Hue)"
          min={-180}
          max={180}
          value={filters.hue}
          onChange={(v) => set("hue", v)}
          unit="°"
        />
        <Range
          label="Temperatura"
          min={-100}
          max={100}
          value={filters.temperature}
          onChange={(v) => set("temperature", v)}
          help="Ujemnie = chłodniej, dodatnio = cieplej."
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