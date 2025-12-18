import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { createRef } from "react";
import { CanvasViewport } from "../CanvasViewport";
import { DEFAULT_FILTERS } from "@/features/editor/types";

vi.mock("../drawing/useDrawingCanvas", () => ({
  useDrawingCanvas: () => ({
    imgRef: { current: null },
    drawCanvasRef: { current: null },
    drawingActive: false,
    handleImageLoad: vi.fn(),
    handlePointerDown: vi.fn(),
    handlePointerMove: vi.fn(),
    handlePointerUp: vi.fn(),
    applyDrawing: vi.fn(),
    clearDrawing: vi.fn(),
  }),
}));

vi.mock("../useViewportImage", () => ({
  useViewportImage: () => ({
    imgDim: { width: 100, height: 100 },
    baseScale: 1,
    onImageLoad: vi.fn(),
  }),
}));

vi.mock("../BusyOverlay", () => ({
  BusyOverlay: () => <div data-testid="busy-overlay" />,
}));

vi.mock("../Dropzone", () => ({
  Dropzone: ({ children, onPickFile }: any) => (
    <div
      data-testid="dropzone"
      onClick={() => onPickFile?.([new File([], "test.png")])}
    >
      {children}
    </div>
  ),
}));

vi.mock("../viewPortImage", () => ({
  ViewportImage: () => <div data-testid="viewport-image" />,
}));

describe("CanvasViewport", () => {
  const baseProps = {
    imageUrl: null,
    onPickFile: vi.fn(),
    filters: DEFAULT_FILTERS,
    cropEnabled: false,
    cropRect: null,
    onChangeCropRect: vi.fn(),
    zoom: 1,
    busy: false,
    drawingMode: "off" as const,
    brushSize: 5,
    brushColor: "#000",
    onApplyDrawing: vi.fn(),
  };

  it("wyświetla placeholder, gdy nie ma obrazu", () => {
    render(<CanvasViewport {...baseProps} />);

    expect(
      screen.getByText(/Przeciągnij obraz tutaj/i)
    ).toBeInTheDocument();
  });

  it("renderuje ViewportImage, gdy imageUrl istnieje", () => {
    render(
      <CanvasViewport {...baseProps} imageUrl="test.png" />
    );

    expect(
      screen.getByTestId("viewport-image")
    ).toBeInTheDocument();
  });

  it("pokazuje BusyOverlay, gdy busy=true", () => {
    render(
      <CanvasViewport {...baseProps} busy />
    );

    expect(
      screen.getByTestId("busy-overlay")
    ).toBeInTheDocument();
  });

  it("wywołuje onPickFile po interakcji z Dropzone", () => {
    render(<CanvasViewport {...baseProps} />);

    fireEvent.click(screen.getByTestId("dropzone"));

    expect(baseProps.onPickFile).toHaveBeenCalled();
  });

  it("udostępnia metody przez ref", () => {
    const ref = createRef<any>();

    render(
      <CanvasViewport {...baseProps} ref={ref} />
    );

    expect(ref.current).toHaveProperty("applyDrawing");
    expect(ref.current).toHaveProperty("cancelDrawing");
  });
});
