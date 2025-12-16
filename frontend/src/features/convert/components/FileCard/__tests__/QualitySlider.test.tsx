import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import QualitySlider from "../components/QualitySlider";

describe("Komponent QualitySlider", () => {
  it("wyświetla etykietę, suwak oraz aktualną wartość", () => {
    render(
      <QualitySlider
        value={75}
        onChange={vi.fn()}
        enabled={true}
      />
    );

    expect(screen.getByText("Jakość")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
  });

  it("pozwala zmienić wartość, gdy suwak jest aktywny", () => {
    const onChange = vi.fn();

    render(
      <QualitySlider
        value={50}
        onChange={onChange}
        enabled={true}
      />
    );

    const slider = screen.getByRole("slider");

    fireEvent.change(slider, {
      target: { value: "80" },
    });

    expect(onChange).toHaveBeenCalledWith(80);
  });

  it("blokuje suwak, gdy enabled=false", () => {
    render(
      <QualitySlider
        value={50}
        onChange={vi.fn()}
        enabled={false}
      />
    );

    const slider = screen.getByRole("slider");

    expect(slider).toBeDisabled();
  });

  it("nie pozwala użytkownikowi zmienić wartości, gdy suwak jest zablokowany", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
        <QualitySlider
        value={50}
        onChange={onChange}
        enabled={false}
        />
    );

    const slider = screen.getByRole("slider");

    await user.click(slider);

    expect(onChange).not.toHaveBeenCalled();
  });
});
