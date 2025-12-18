import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ColorSection from "../ColorSection";
import { DEFAULT_FILTERS } from "@/features/editor/types";


vi.mock("../SectionShell", () => ({
  default: ({ title, children }: any) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

vi.mock("@/features/editor/ui/Range", () => ({
  default: ({ label, onChange }: any) => (
    <button onClick={() => onChange(50)}>
      {label}
    </button>
  ),
}));


const setup = (props?: Partial<React.ComponentProps<typeof ColorSection>>) => {
  const defaults = {
    filters: DEFAULT_FILTERS,
    setFilters: vi.fn(),
    onSaveHistory: vi.fn(),
    onResetFilters: vi.fn(),
    openIds: new Set<string>(["colors"]),
    toggle: vi.fn(),
  };

  render(<ColorSection {...defaults} {...props} />);

  return {
    ...defaults,
    ...props,
  };
};


describe("Komponent ColorSection", () => {
  it("renderuje nagłówek sekcji", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Kolory" })
    ).toBeInTheDocument();
  });

  it("renderuje wszystkie suwaki kolorów", () => {
    setup();

    expect(screen.getByText("Jasność")).toBeInTheDocument();
    expect(screen.getByText("Kontrast")).toBeInTheDocument();
    expect(screen.getByText("Nasycenie")).toBeInTheDocument();
    expect(screen.getByText("Odcień (Hue)")).toBeInTheDocument();
    expect(screen.getByText("Temperatura")).toBeInTheDocument();
  });

  it("zmiana suwaka wywołuje setFilters", () => {
    const { setFilters } = setup();

    fireEvent.click(screen.getByText("Jasność"));

    expect(setFilters).toHaveBeenCalledTimes(1);
    expect(setFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        brightness: 50,
      })
    );
  });

  it("zapisuje historię po zakończeniu interakcji", () => {
    const { onSaveHistory } = setup();

    const container = screen.getByText("Jasność").parentElement!;
    fireEvent.pointerUp(container);

    expect(onSaveHistory).toHaveBeenCalledTimes(1);
  });

  it("wywołuje onResetFilters po kliknięciu przycisku resetu", () => {
    const { onResetFilters } = setup();

    fireEvent.click(
      screen.getByRole("button", { name: "Resetuj kolory i filtry" })
    );

    expect(onResetFilters).toHaveBeenCalledTimes(1);
  });
});
