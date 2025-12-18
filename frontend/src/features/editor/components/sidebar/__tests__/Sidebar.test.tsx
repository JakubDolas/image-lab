import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "../Sidebar";
import type { Filters } from "@/features/editor/types";

const filters: Filters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hue: 0,
  grayscale: 0,
  invert: 0,
  sepia: 0,
  blur: 0,
  temperature: 0,
};

const baseProps = {
  busy: false,
  onRemoveBg: vi.fn(),
  onUpscale: vi.fn(),
  onPickOther: vi.fn(),

  filters,
  setFilters: vi.fn(),
  onSaveHistory: vi.fn(),
  onResetFilters: vi.fn(),

  cropEnabled: false,
  onStartCrop: vi.fn(),
  onApplyCrop: vi.fn(),
  onCancelCrop: vi.fn(),

  drawingMode: "off" as const,
  brushSize: 10,
  brushColor: "#000000",
  onSetDraw: vi.fn(),
  onSetErase: vi.fn(),
  onChangeBrushSize: vi.fn(),
  onChangeBrushColor: vi.fn(),
  onApplyDrawingClick: vi.fn(),
  onCancelDrawingClick: vi.fn(),

  historyItems: [],
  imageInfo: null,
};

describe("Sidebar", () => {
  it("renderuje nagłówek i sekcje", () => {
    render(<Sidebar {...baseProps} />);

    expect(screen.getByText("Narzędzia")).toBeInTheDocument();
    expect(screen.getByText("Narzędzia AI")).toBeInTheDocument();
    expect(screen.getByText("Kolory")).toBeInTheDocument();
    expect(screen.getByText("Efekty")).toBeInTheDocument();
    expect(screen.getByText("Rysowanie")).toBeInTheDocument();
    expect(screen.getByText("Kadrowanie")).toBeInTheDocument();
  });

  it("po kliknięciu nagłówka sekcji pokazuje jej zawartość", () => {
    render(<Sidebar {...baseProps} />);

    fireEvent.click(screen.getByText("Kolory"));

    expect(screen.getByText("Jasność")).toBeInTheDocument();
  });

  it("blokuje inne sekcje gdy busy=true", () => {
    render(<Sidebar {...baseProps} busy />);

    const title = screen.getByText("Narzędzia AI");

    const sectionShell = title.closest("div")!;
    const wrapper = sectionShell.parentElement!;

    expect(wrapper).toHaveClass("opacity-60");
    expect(wrapper).toHaveClass("pointer-events-none");
  });

  it("renderuje historię, gdy są elementy", () => {
    render(
      <Sidebar
        {...baseProps}
        historyItems={["Zmieniono jasność", "Zastosowano sepia"]}
      />
    );

    expect(screen.getByText("Historia")).toBeInTheDocument();
    expect(screen.getByText("Zmieniono jasność")).toBeInTheDocument();
  });

  it("renderuje panel informacji o obrazie", () => {
    render(
      <Sidebar
        {...baseProps}
        imageInfo={{
          width: 800,
          height: 600,
          format: "PNG",
          sizeBytes: 123456,
        }}
      />
    );

    expect(screen.getByText("Informacje o obrazie")).toBeInTheDocument();
    expect(screen.getByText("800 × 600 px")).toBeInTheDocument();
    expect(screen.getByText("PNG")).toBeInTheDocument();
  });
});
