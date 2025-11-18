import { motion, AnimatePresence } from "framer-motion";

type Props = {
  id: string;
  title: string;
  openIds: Set<string>;
  toggle: (id: string) => void;
  children: React.ReactNode;
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

export default function SectionShell({
  id,
  title,
  openIds,
  toggle,
  children,
}: Props) {
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
