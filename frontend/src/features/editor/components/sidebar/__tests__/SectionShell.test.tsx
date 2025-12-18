import { render, screen, fireEvent } from "@testing-library/react";
import SectionShell from "../SectionShell";

describe("SectionShell", () => {
  const renderComponent = (
    openIds = new Set<string>(),
    toggle = vi.fn()
  ) =>
    render(
      <SectionShell
        id="test"
        title="Testowa sekcja"
        openIds={openIds}
        toggle={toggle}
      >
        <div>Treść sekcji</div>
      </SectionShell>
    );

  it("renderuje tytuł sekcji", () => {
    renderComponent();

    expect(
      screen.getByText("Testowa sekcja")
    ).toBeInTheDocument();
  });

  it("nie renderuje treści, gdy sekcja jest zamknięta", () => {
    renderComponent();

    expect(
      screen.queryByText("Treść sekcji")
    ).not.toBeInTheDocument();
  });

  it("renderuje treść, gdy sekcja jest otwarta", () => {
    renderComponent(new Set(["test"]));

    expect(
      screen.getByText("Treść sekcji")
    ).toBeInTheDocument();
  });

  it("wywołuje toggle z poprawnym id po kliknięciu nagłówka", () => {
    const toggle = vi.fn();
    renderComponent(new Set(), toggle);

    fireEvent.click(
      screen.getByRole("button", { name: /testowa sekcja/i })
    );

    expect(toggle).toHaveBeenCalledWith("test");
  });
});
