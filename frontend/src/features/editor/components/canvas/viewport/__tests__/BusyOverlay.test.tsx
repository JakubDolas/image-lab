import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BusyOverlay } from "../BusyOverlay";

describe("Komponent BusyOverlay", () => {
  it("renderuje overlay blokujący widok", () => {
    const { container } = render(<BusyOverlay />);

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass("absolute");
    expect(overlay).toHaveClass("inset-0");
  });

  it("zawiera spinner ładowania", () => {
    const { container } = render(<BusyOverlay />);

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});
