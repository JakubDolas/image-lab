import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import ResizeModal from "../ResizeModal";

vi.mock("../ModalShell", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../PreviewCanvas", () => ({
  default: () => <div>PREVIEW_CANVAS</div>,
}));

vi.mock("../ControlsPanel/ControlsPanel", () => ({
  default: () => <div>CONTROLS_PANEL</div>,
}));

vi.mock("../hooks/useResizeState", () => ({
  useResizeState: vi.fn(),
}));

import { useResizeState } from "../hooks/useResizeState";

beforeEach(() => {
  vi.clearAllMocks();

  (useResizeState as any).mockReturnValue({
    url: "blob:test",
    keepAspect: true,
    boxRef: { current: null },
    preview: {
      pw: 800,
      ph: 600,
      dw: 800,
      dh: 600,
      s: 1,
    },
    nat: { w: 1920, h: 1080 },

    startResize: vi.fn(),
    refit: vi.fn(),
    changeW: vi.fn(),
    changeH: vi.fn(),
    setKeepAspect: vi.fn(),
    setLimitToOrig: vi.fn(),
    setExactSize: vi.fn(),
    apply: vi.fn(),
    onClose: vi.fn(),
    limitToOrig: false,
  });
});

describe("Komponent ResizeModal", () => {
  it("wyświetla tytuł oraz zawartość modala", () => {
    render(
      <ResizeModal
        file={new File(["a"], "a.png")}
        initialWidth={800}
        initialHeight={600}
        keepAspectDefault
        limitToOriginalDefault={false}
        onApply={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(
      screen.getByText("Zmień rozmiar")
    ).toBeInTheDocument();

    expect(
      screen.getByText("PREVIEW_CANVAS")
    ).toBeInTheDocument();

    expect(
      screen.getByText("CONTROLS_PANEL")
    ).toBeInTheDocument();
  });

  it("wywołuje onClose po kliknięciu przycisku zamknięcia", async () => {
    const user = userEvent.setup();
    const stateOnClose = vi.fn();

    (useResizeState as any).mockReturnValue({
        url: "blob:test",
        keepAspect: true,
        boxRef: { current: null },
        preview: {
        pw: 800,
        ph: 600,
        dw: 800,
        dh: 600,
        s: 1,
        },
        nat: { w: 1920, h: 1080 },

        startResize: vi.fn(),
        refit: vi.fn(),
        changeW: vi.fn(),
        changeH: vi.fn(),
        setKeepAspect: vi.fn(),
        setLimitToOrig: vi.fn(),
        setExactSize: vi.fn(),
        apply: vi.fn(),
        onClose: stateOnClose,
        limitToOrig: false,
    });

    render(
        <ResizeModal
        file={new File(["a"], "a.png")}
        initialWidth={800}
        initialHeight={600}
        keepAspectDefault
        limitToOriginalDefault={false}
        onApply={vi.fn()}
        onClose={vi.fn()}
        />
    );

    await user.click(
        screen.getByRole("button", { name: "✕" })
    );

    expect(stateOnClose).toHaveBeenCalled();
  });
});
