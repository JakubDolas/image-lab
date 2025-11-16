import SectionShell from "./SectionShell";

type Props = {
  busy: boolean;
  onRemoveBg: () => void;
  openIds: Set<string>;
  toggle: (id: string) => void;
};

export default function AiSection({
  busy,
  onRemoveBg,
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
    </SectionShell>
  );
}
