import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ZoomPanel } from "../ZoomPanel";

describe("Komponent ZoomPanel", () => {
  const setup = (props?: Partial<React.ComponentProps<typeof ZoomPanel>>) => {
    const user = userEvent.setup();

    const defaults = {
      zoom: 1,
      minZoom: 0.5,
      maxZoom: 2,
      onZoomIn: vi.fn(),
      onZoomOut: vi.fn(),
      onReset: vi.fn(),
    };

    render(<ZoomPanel {...defaults} {...props} />);

    return {
      user,
      ...defaults,
      ...props,
    };
  };

  it("wyświetla aktualny zoom w procentach", () => {
    setup({ zoom: 1.25 });

    expect(screen.getByText("125%")).toBeInTheDocument();
  });

  it("wywołuje onZoomIn po kliknięciu +", async () => {
    const { user, onZoomIn } = setup();

    await user.click(screen.getByText("+"));

    expect(onZoomIn).toHaveBeenCalledTimes(1);
  });

  it("wywołuje onZoomOut po kliknięciu −", async () => {
    const { user, onZoomOut } = setup();

    await user.click(screen.getByText("−"));

    expect(onZoomOut).toHaveBeenCalledTimes(1);
  });

  it("wywołuje onReset po kliknięciu w wartość procentową", async () => {
    const { user, onReset } = setup({ zoom: 1.3 });

    await user.click(screen.getByText("130%"));

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("blokuje przycisk zoom out przy minZoom", () => {
    setup({ zoom: 0.5 });

    const zoomOut = screen.getByText("−");
    expect(zoomOut).toBeDisabled();
  });

  it("blokuje przycisk zoom in przy maxZoom", () => {
    setup({ zoom: 2 });

    const zoomIn = screen.getByText("+");
    expect(zoomIn).toBeDisabled();
  });
});
