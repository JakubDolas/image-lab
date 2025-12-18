import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import ControlsPanel from "../ControlsPanel";

vi.mock(
  "../../hooks/useResizePresets",
  () => ({
    useResizePresets: vi.fn(),
  })
);

import { useResizePresets } from "../../hooks/useResizePresets";


beforeEach(() => {
  vi.clearAllMocks();

  (useResizePresets as any).mockReturnValue({
    portrait: false,
    setPortrait: vi.fn(),
    picked: null,
    activeRatio: null,
    selectedPreset: null,
    pickRatio: vi.fn(),
    applyPreset: vi.fn(),
    PRESET_WIDTHS: {},
  });
});


describe("Komponent ControlsPanel (ResizeModal)", () => {
  it("wyświetla informacje o oryginalnym rozmiarze", () => {
    render(
      <ControlsPanel
        nat={{ w: 1920, h: 1080 }}
        w={800}
        h={600}
        keepAspect={true}
        setKeepAspect={vi.fn()}
        limitToOrig={false}
        setLimitToOrig={vi.fn()}
        onChangeW={vi.fn()}
        onChangeH={vi.fn()}
        onPickSize={vi.fn()}
        onApply={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(
      screen.getByText("1920×1080 px")
    ).toBeInTheDocument();
  });

  it("wyświetla pola szerokość i wysokość", () => {
    render(
      <ControlsPanel
        nat={null}
        w={800}
        h={600}
        keepAspect={false}
        setKeepAspect={vi.fn()}
        limitToOrig={false}
        setLimitToOrig={vi.fn()}
        onChangeW={vi.fn()}
        onChangeH={vi.fn()}
        onPickSize={vi.fn()}
        onApply={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(
      screen.getByPlaceholderText("W")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("H")
    ).toBeInTheDocument();
  });

  it("pozwala zaznaczyć i odznaczyć checkboxy", async () => {
    const user = userEvent.setup();
    const setKeepAspect = vi.fn();
    const setLimitToOrig = vi.fn();

    render(
      <ControlsPanel
        nat={null}
        w={800}
        h={600}
        keepAspect={false}
        setKeepAspect={setKeepAspect}
        limitToOrig={false}
        setLimitToOrig={setLimitToOrig}
        onChangeW={vi.fn()}
        onChangeH={vi.fn()}
        onPickSize={vi.fn()}
        onApply={vi.fn()}
        onClose={vi.fn()}
      />
    );

    await user.click(
      screen.getByLabelText("Zachowaj proporcje")
    );

    expect(setKeepAspect).toHaveBeenCalledWith(true);

    await user.click(
      screen.getByLabelText("Nie powiększaj")
    );

    expect(setLimitToOrig).toHaveBeenCalledWith(true);
  });

  it("wywołuje onClose po kliknięciu Anuluj", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <ControlsPanel
        nat={null}
        w={800}
        h={600}
        keepAspect={false}
        setKeepAspect={vi.fn()}
        limitToOrig={false}
        setLimitToOrig={vi.fn()}
        onChangeW={vi.fn()}
        onChangeH={vi.fn()}
        onPickSize={vi.fn()}
        onApply={vi.fn()}
        onClose={onClose}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Anuluj" })
    );

    expect(onClose).toHaveBeenCalled();
  });

  it("wywołuje onApply po kliknięciu Zastosuj", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    render(
      <ControlsPanel
        nat={null}
        w={800}
        h={600}
        keepAspect={false}
        setKeepAspect={vi.fn()}
        limitToOrig={false}
        setLimitToOrig={vi.fn()}
        onChangeW={vi.fn()}
        onChangeH={vi.fn()}
        onPickSize={vi.fn()}
        onApply={onApply}
        onClose={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Zastosuj" })
    );

    expect(onApply).toHaveBeenCalled();
  });
});
