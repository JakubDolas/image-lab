import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import FileCard from "../FileCard";

vi.mock("../components/Thumb", () => ({
  default: () => <div data-testid="thumb" />,
}));

vi.mock("../components/QualitySlider", () => ({
  default: ({
    enabled,
  }: {
    enabled: boolean;
  }) => (
    <div data-testid="quality-slider">
      {enabled ? "enabled" : "disabled"}
    </div>
  ),
}));

vi.mock("../components/FormatGrid", () => ({
  default: ({
    onPick,
  }: {
    onPick: (fmt: string) => void;
  }) => (
    <button onClick={() => onPick("webp")}>
      wybierz-webp
    </button>
  ),
}));

vi.mock("@/features/convert/components/ResizeModal", () => ({
  default: ({
    onClose,
  }: {
    onClose: () => void;
  }) => (
    <div>
      <span>ResizeModal</span>
      <button onClick={onClose}>zamknij</button>
    </div>
  ),
}));


const file = new File(["abc"], "test.png", {
  type: "image/png",
});

const defaultProps = {
  file,
  previewBlob: file,
  index: 0,
  currentFormat: "png",
  onPickFormat: vi.fn(),
  quality: 80,
  onQuality: vi.fn(),
  onRemove: vi.fn(),
  availableFormats: ["png", "webp"],
  labelMap: {
    png: "PNG",
    webp: "WEBP",
  },
};

describe("Komponent FileCard", () => {
  it("wyświetla nazwę pliku, format oraz miniaturę", () => {
    render(<FileCard {...defaultProps} />);

    expect(
      screen.getByText("test.png")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/format:/i)
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("thumb")
    ).toBeInTheDocument();
  });

  it("wywołuje onRemove z poprawnym indeksem po kliknięciu przycisku Usuń", async () => {
    const user = userEvent.setup();

    render(<FileCard {...defaultProps} />);

    await user.click(
      screen.getByRole("button", { name: /usuń/i })
    );

    expect(defaultProps.onRemove).toHaveBeenCalledWith(0);
  });

  it("pokazuje informację o zmienionym rozmiarze, gdy przekazano size", () => {
    render(
      <FileCard
        {...defaultProps}
        size={{ width: 800, height: 600 }}
      />
    );

    expect(
      screen.getByText(/Zmieniony rozmiar/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText("800 × 600 px")
    ).toBeInTheDocument();
  });

  it("otwiera i zamyka modal zmiany rozmiaru", async () => {
    const user = userEvent.setup();

    render(<FileCard {...defaultProps} />);

    await user.click(
      screen.getByRole("button", {
        name: /zmień rozmiar/i,
      })
    );

    expect(
      screen.getByText("ResizeModal")
    ).toBeInTheDocument();

    await user.click(
      screen.getByText("zamknij")
    );

    expect(
      screen.queryByText("ResizeModal")
    ).not.toBeInTheDocument();
  });

  it("aktywuje suwak jakości tylko dla formatów stratnych (lossy)", () => {
    render(
      <FileCard
        {...defaultProps}
        currentFormat="webp"
      />
    );

    expect(
      screen.getByText("enabled")
    ).toBeInTheDocument();
  });

  it("dezaktywuje suwak jakości dla formatów bezstratnych", () => {
    render(
      <FileCard
        {...defaultProps}
        currentFormat="png"
      />
    );

    expect(
      screen.getByText("disabled")
    ).toBeInTheDocument();
  });

  it("wywołuje onPickFormat po wybraniu formatu wyjściowego", async () => {
    const user = userEvent.setup();

    render(<FileCard {...defaultProps} />);

    await user.click(
      screen.getByText("wybierz-webp")
    );

    expect(
      defaultProps.onPickFormat
    ).toHaveBeenCalledWith("webp");
  });
});
