import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Range from "@/features/editor/ui/Range";
import type { Filters } from "@/features/editor/types";

type Props = {
  busy: boolean;
  onRemoveBg: () => void;
  onPickOther: () => void;

  filters: Filters;
  setFilters: (f: Filters) => void;
  onResetFilters: () => void;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="shrink-0 text-slate-300"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.18 }}
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 9l6 6 6-6"
      />
    </motion.svg>
  );
}

export default function Sidebar({
  busy,
  onRemoveBg,
  onPickOther,
  filters,
  setFilters,
  onResetFilters,
}: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const set = <K extends keyof Filters>(k: K, v: number) =>
    setFilters({ ...filters, [k]: v });

  return (
    <aside className="w-[260px] rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-3">
      <div className="px-2 pb-2 text-[11px] uppercase tracking-wider text-slate-400">
        Narzędzia
      </div>

      <div className="flex flex-col gap-2">
        <Section id="ai" title="Narzędzia AI" openIds={openIds} toggle={toggle}>
          <button
            type="button"
            className="h-9 w-full rounded-xl bg-indigo-600 px-3 text-sm text-white hover:brightness-110 disabled:opacity-50"
            onClick={onRemoveBg}
            disabled={busy}
          >
            Usuń tło (AI)
          </button>
        </Section>

        <Section
          id="colors"
          title="Kolory"
          openIds={openIds}
          toggle={toggle}
        >
          <div className="space-y-3">
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
        </Section>

        <Section
          id="effects"
          title="Efekty"
          openIds={openIds}
          toggle={toggle}
        >
          <div className="space-y-3">
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
        </Section>
        

        <Section id="file" title="Plik" openIds={openIds} toggle={toggle}>
          <button
            type="button"
            onClick={onPickOther}
            className="h-9 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm hover:bg-white/15"
          >
            Wybierz inne zdjęcie
          </button>
        </Section>
      </div>
    </aside>
  );
}

function Section({
  id,
  title,
  openIds,
  toggle,
  children,
}: {
  id: string;
  title: string;
  openIds: Set<string>;
  toggle: (id: string) => void;
  children: React.ReactNode;
}) {
  const open = openIds.has(id);
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <button
        type="button"
        onClick={() => toggle(id)}
        className="flex h-10 w-full items-center justify-between gap-3 px-3 text-left"
      >
        <span className="text-sm text-slate-200">{title}</span>
        <Chevron open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="px-3 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
