import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DrawingSection from "../DrawingSection";

vi.mock("../SectionShell", () => ({
  default: ({ title, children }: any) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
}));

vi.mock("@/features/editor/ui/Range", () => ({
  default: ({ label, value, onChange }: any) => (
    <label>
      {label}
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  ),
}));

const setup = (
  props?: Partial<React.ComponentProps<typeof DrawingSection>>
) => {
  const defaults = {
    openIds: new Set<string>(["drawing"]),
    toggle: vi.fn(),

    drawingMode: "off" as const,
    brushSize: 10,
    brushColor: "#ff0000",

    onSetDraw: vi.fn(),
    onSetErase: vi.fn(),
    onCancelDrawingClick: vi.fn(),
    onApplyDrawingClick: vi.fn(),
    onChangeBrushSize: vi.fn(),
    onChangeBrushColor: vi.fn(),
  };

  render(<DrawingSection {...defaults} {...props} />);

  return { ...defaults, ...props };
};

describe("Komponent DrawingSection", () => {
  it("renderuje nagłówek sekcji", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Rysowanie" })
    ).toBeInTheDocument();
  });

  it("wywołuje onSetDraw po kliknięciu przycisku pędzla", () => {
    const { onSetDraw } = setup();

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(onSetDraw).toHaveBeenCalledTimes(1);
  });

  it("wywołuje onSetErase po kliknięciu przycisku gumki", () => {
    const { onSetErase } = setup();

    fireEvent.click(screen.getAllByRole("button")[1]);

    expect(onSetErase).toHaveBeenCalledTimes(1);
  });

  it("wywołuje onChangeBrushSize po zmianie grubości", () => {
    const { onChangeBrushSize } = setup();

    fireEvent.change(screen.getByRole("slider"), {
      target: { value: "25" },
    });

    expect(onChangeBrushSize).toHaveBeenCalledWith(25);
  });

  it("wywołuje onChangeBrushColor po zmianie koloru", () => {
    const { onChangeBrushColor } = setup();

    fireEvent.change(screen.getByDisplayValue("#ff0000"), {
      target: { value: "#00ff00" },
    });

    expect(onChangeBrushColor).toHaveBeenCalledWith("#00ff00");
  });

  it("pokazuje przyciski Zastosuj i Anuluj gdy rysowanie jest aktywne", () => {
    setup({ drawingMode: "draw" });

    expect(
      screen.getByRole("button", { name: "Zastosuj" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Anuluj" })
    ).toBeInTheDocument();
  });

  it("wywołuje callbacki po kliknięciu Zastosuj i Anuluj", () => {
    const { onApplyDrawingClick, onCancelDrawingClick } = setup({
      drawingMode: "draw",
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Zastosuj" })
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Anuluj" })
    );

    expect(onApplyDrawingClick).toHaveBeenCalledTimes(1);
    expect(onCancelDrawingClick).toHaveBeenCalledTimes(1);
  });

  it("nie pokazuje przycisków Zastosuj i Anuluj gdy rysowanie jest wyłączone", () => {
    setup({ drawingMode: "off" });

    expect(
      screen.queryByRole("button", { name: "Zastosuj" })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Anuluj" })
    ).not.toBeInTheDocument();
  });
});
