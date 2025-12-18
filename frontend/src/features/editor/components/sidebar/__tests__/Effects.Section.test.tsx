import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EffectsSection from "../EffectsSection";
import type { Filters } from "@/features/editor/types";

vi.mock("../SectionShell", () => ({
  default: ({ title, children }: any) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

vi.mock("@/features/editor/ui/Range", () => ({
  default: ({ label, value, onChange }: any) => (
    <label>
      {label}
      <input
        aria-label={label}
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  ),
}));


const filters: Filters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hue: 0,
  temperature: 0,
  sepia: 0,
  grayscale: 0,
  invert: 0,
  blur: 0,
};

const setup = () => {
  const setFilters = vi.fn();
  const onSaveHistory = vi.fn();
  const onResetFilters = vi.fn();

  render(
    <EffectsSection
      filters={filters}
      setFilters={setFilters}
      onSaveHistory={onSaveHistory}
      onResetFilters={onResetFilters}
      openIds={new Set(["effects"])}
      toggle={vi.fn()}
    />
  );

  return { setFilters, onSaveHistory, onResetFilters };
};

describe("Komponent EffectsSection", () => {
  it("renderuje nagłówek sekcji", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Efekty" })
    ).toBeInTheDocument();
  });

  it("renderuje suwaki efektów", () => {
    setup();

    expect(screen.getByText("Sepia")).toBeInTheDocument();
    expect(screen.getByText("Czarno-białe")).toBeInTheDocument();
    expect(screen.getByText("Negatyw")).toBeInTheDocument();
    expect(screen.getByText("Rozmycie")).toBeInTheDocument();
  });

  it("zmiana suwaka wywołuje setFilters", () => {
    const { setFilters } = setup();

    fireEvent.change(
        screen.getByLabelText("Sepia"),
        { target: { value: "30" } }
    );

    expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ sepia: 30 })
    );
  });

  it("wywołuje onSaveHistory po interakcji z suwakami", () => {
    const { onSaveHistory } = setup();

    fireEvent.pointerUp(screen.getByText("Sepia"));
    fireEvent.touchEnd(screen.getByText("Sepia"));

    expect(onSaveHistory).toHaveBeenCalled();
  });

  it("wywołuje onResetFilters po kliknięciu przycisku resetu", () => {
    const { onResetFilters } = setup();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Resetuj kolory i filtry",
      })
    );

    expect(onResetFilters).toHaveBeenCalledTimes(1);
  });
});
