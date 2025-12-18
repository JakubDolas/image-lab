import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { CropOverlay } from "../CropOverlay";
import type { DragKind } from "../crop.types";

const beginDragMock = vi.fn();

vi.mock("../useCropDrag", () => ({
  useCropDrag: () => ({
    containerRef: { current: null },
    style: { top: "10%", left: "10%", width: "50%", height: "40%" },
    beginDrag: (kind: DragKind) => beginDragMock(kind),
  }),
}));

describe("CropOverlay", () => {
  const rect = {
    x: 0.1,
    y: 0.1,
    width: 0.5,
    height: 0.4,
  };

  const onChange = vi.fn();

  it("renderuje overlay cropa", () => {
    render(<CropOverlay rect={rect} onChange={onChange} />);

    expect(
      document.querySelector(".border-indigo-400")
    ).toBeInTheDocument();
  });

  it("renderuje cztery uchwyty narożne", () => {
    render(<CropOverlay rect={rect} onChange={onChange} />);

    const handles = document.querySelectorAll(
      ".rounded-full.border.border-white"
    );

    expect(handles).toHaveLength(4);
  });

  it("wywołuje beginDrag('move') po kliknięciu w obszar cropa", () => {
    render(<CropOverlay rect={rect} onChange={onChange} />);

    const overlay = document.querySelector(
      ".border-indigo-400"
    ) as HTMLElement;

    fireEvent.mouseDown(overlay);

    expect(beginDragMock).toHaveBeenCalledWith("move");
  });

  it("wywołuje beginDrag po kliknięciu w uchwyt", () => {
    render(<CropOverlay rect={rect} onChange={onChange} />);

    const handle = document.querySelector(
      ".rounded-full.border.border-white"
    ) as HTMLElement;

    fireEvent.mouseDown(handle);

    expect(beginDragMock).toHaveBeenCalled();
  });
});
