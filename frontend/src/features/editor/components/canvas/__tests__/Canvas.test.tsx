import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React, { createRef } from "react";
import Canvas from "../Canvas";
import type { CanvasHandle } from "../canvas.types";
import { DEFAULT_FILTERS } from "@/features/editor/types";


vi.mock("../viewport/CanvasViewport", () => ({
  CanvasViewport: React.forwardRef((_props: any, ref) => {
    React.useImperativeHandle(ref, () => ({
      applyDrawing: vi.fn(),
      cancelDrawing: vi.fn(),
    }));

    return <div data-testid="canvas-viewport" />;
  }),
}));

vi.mock("../zoom/ZoomPanel", () => ({
  ZoomPanel: () => <div data-testid="zoom-panel" />,
}));


const baseProps = {
  imageUrl: null as string | null,
  onPickFile: vi.fn(),
  filters: DEFAULT_FILTERS,
  cropEnabled: false,
  cropRect: null,
  onChangeCropRect: vi.fn(),
  busy: false,
  drawingMode: "off" as const,
  brushSize: 5,
  brushColor: "#000",
  onApplyDrawing: vi.fn(),
};


describe("Komponent Canvas", () => {
  it("renderuje CanvasViewport", () => {
    render(<Canvas {...baseProps} />);

    expect(screen.getByTestId("canvas-viewport")).toBeInTheDocument();
  });

  it("nie renderuje ZoomPanel, gdy brak imageUrl", () => {
    render(<Canvas {...baseProps} imageUrl={null} />);

    expect(screen.queryByTestId("zoom-panel")).not.toBeInTheDocument();
  });

  it("renderuje ZoomPanel, gdy imageUrl jest ustawione", () => {
    render(<Canvas {...baseProps} imageUrl="test.jpg" />);

    expect(screen.getByTestId("zoom-panel")).toBeInTheDocument();
  });

  it("udostępnia metody applyDrawing i cancelDrawing przez ref", () => {
    const ref = createRef<CanvasHandle>();

    render(<Canvas {...baseProps} ref={ref} imageUrl="test.jpg" />);

    expect(ref.current).toBeDefined();
    expect(ref.current?.applyDrawing).toBeInstanceOf(Function);
    expect(ref.current?.cancelDrawing).toBeInstanceOf(Function);
  });
});
