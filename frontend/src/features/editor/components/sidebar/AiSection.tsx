import SectionShell from "./SectionShell";

type Props = {
  busy: boolean;
  onRemoveBg: () => void;
  onUpscale: () => void;
  openIds: Set<string>;
  toggle: (id: string) => void;
};

export default function AiSection({
  busy,
  onRemoveBg,
  onUpscale,
  openIds,
  toggle,
}: Props) {
  return (
    <SectionShell
      id="ai"
      title="Narzędzia AI"
      openIds={openIds}
      toggle={toggle}
    >
      <button
        type="button"
        className="h-9 w-full rounded-xl bg-indigo-600 px-3 text-sm text-white hover:brightness-110 disabled:opacity-50"
        onClick={onRemoveBg}
        disabled={busy}
      >
        Usuń tło (AI)
      </button>
      
      <button
          type="button"
          onClick={onUpscale}
          disabled={busy}
          className="h-9 w-full mt-3 rounded-xl bg-emerald-500 px-3 text-sm text-white hover:brightness-110 disabled:opacity-50"
        >
          Upscaluj obraz
        </button>
    </SectionShell>
  );
}
