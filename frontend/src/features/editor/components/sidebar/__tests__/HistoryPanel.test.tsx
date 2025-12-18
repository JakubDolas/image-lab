import { render, screen } from "@testing-library/react";
import HistoryPanel from "../HistoryPanel";

describe("HistoryPanel", () => {
  it("nie renderuje się, gdy lista jest pusta", () => {
    const { container } = render(<HistoryPanel items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("nie renderuje się, gdy items = null / undefined", () => {
    const { container } = render(
      // @ts-expect-error testujemy brak danych
      <HistoryPanel items={undefined} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renderuje nagłówek Historia", () => {
    render(<HistoryPanel items={["Zmieniono jasność"]} />);
    expect(screen.getByText("Historia")).toBeInTheDocument();
  });

  it("renderuje wszystkie elementy historii", () => {
    const items = [
      "Zmieniono jasność",
      "Zastosowano sepia",
      "Przycięto obraz",
    ];

    render(<HistoryPanel items={items} />);

    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("renderuje znaczniki ✓ przy elementach", () => {
    render(<HistoryPanel items={["Test"]} />);
    expect(screen.getByText("✓")).toBeInTheDocument();
  });
});
