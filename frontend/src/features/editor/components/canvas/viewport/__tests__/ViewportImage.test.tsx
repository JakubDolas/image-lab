import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ViewportImage } from "../viewPortImage";
import type { CropRect } from "@/features/editor/types";

describe("Komponent ViewportImage", () => {
  const baseProps = {
    imageUrl: "test.jpg",
    cssFilter: "brightness(1)",
    imgRef: { current: null },
    canvasRef: { current: null },
    imgDim: { w: 100, h: 80 },
    scale: 1,
    cropEnabled: false,
    cropRect: null as CropRect | null,
    onChangeCropRect: vi.fn(),
    drawingActive: false,
    drawingMode: "off" as const,
    onImageLoad: vi.fn(),
    onPointerDown: vi.fn(),
    onPointerMove: vi.fn(),
    onPointerUp: vi.fn(),
  };

  it("renderuje obraz z poprawnym src i alt", () => {
    const { getByAltText } = render(<ViewportImage {...baseProps} />);

    const img = getByAltText("Edytowany obraz") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("test.jpg");
  });

  it("wywołuje onImageLoad po załadowaniu obrazu", () => {
    const onImageLoad = vi.fn();

    const { getByAltText } = render(
      <ViewportImage {...baseProps} onImageLoad={onImageLoad} />
    );

    fireEvent.load(getByAltText("Edytowany obraz"));
    expect(onImageLoad).toHaveBeenCalled();
  });

  it("renderuje CropOverlay gdy cropEnabled = true", () => {
    const rect: CropRect = { x: 0.1, y: 0.1, width: 0.5, height: 0.5 };

    const { container } = render(
      <ViewportImage
        {...baseProps}
        cropEnabled
        cropRect={rect}
      />
    );

    expect(
      container.querySelector(".pointer-events-none.absolute.inset-0")
    ).toBeInTheDocument();
  });

  it("nie renderuje CropOverlay gdy cropEnabled = false", () => {
    const { container } = render(<ViewportImage {...baseProps} />);

    expect(
      container.querySelector(".pointer-events-none.absolute.inset-0")
    ).not.toBeInTheDocument();
  });

  it("przekazuje zdarzenia myszy do canvas", () => {
    const onPointerDown = vi.fn();
    const onPointerMove = vi.fn();
    const onPointerUp = vi.fn();

    const { container } = render(
      <ViewportImage
        {...baseProps}
        drawingActive
        drawingMode="draw"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
    );

    const canvas = container.querySelector("canvas")!;
    fireEvent.mouseDown(canvas);
    fireEvent.mouseMove(canvas);
    fireEvent.mouseUp(canvas);

    expect(onPointerDown).toHaveBeenCalled();
    expect(onPointerMove).toHaveBeenCalled();
    expect(onPointerUp).toHaveBeenCalled();
  });

  it("ustawia odpowiedni cursor w trybie rysowania", () => {
    const { container } = render(
      <ViewportImage
        {...baseProps}
        drawingActive
        drawingMode="erase"
      />
    );

    const canvas = container.querySelector("canvas")!;
    expect(canvas.style.cursor).toBe("cell");
  });
});
