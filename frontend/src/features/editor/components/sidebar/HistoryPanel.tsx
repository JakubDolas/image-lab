import type { FC } from "react";

type HistoryPanelProps = {
  items: string[];
};

const HistoryPanel: FC<HistoryPanelProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-slate-200">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Historia
      </div>
      <ul className="space-y-1">
        {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
                <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-md bg-white/10 text-[13px]">
                    ✓
                </span>
                <span className="leading-snug break-words">{item}</span>
            </li>
        ))}
      </ul>
    </section>
  );
};

export default HistoryPanel;
