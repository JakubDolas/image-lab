import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AiSection from "../AiSection";

vi.mock("../SectionShell", () => ({
  default: ({ title, children }: any) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

const setup = (props?: Partial<React.ComponentProps<typeof AiSection>>) => {
  const user = userEvent.setup();

  const defaults = {
    busy: false,
    onRemoveBg: vi.fn(),
    onUpscale: vi.fn(),
    openIds: new Set<string>(["ai"]),
    toggle: vi.fn(),
  };

  render(<AiSection {...defaults} {...props} />);

  return {
    user,
    ...defaults,
    ...props,
  };
};

describe("Komponent AiSection", () => {
  it("renderuje nagłówek sekcji", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Narzędzia AI" })
    ).toBeInTheDocument();
  });

  it("renderuje oba przyciski AI", () => {
    setup();

    expect(
      screen.getByRole("button", { name: "Usuń tło (AI)" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Upscaluj obraz" })
    ).toBeInTheDocument();
  });

  it("wywołuje onRemoveBg po kliknięciu przycisku usuwania tła", async () => {
    const { user, onRemoveBg } = setup();

    await user.click(
      screen.getByRole("button", { name: "Usuń tło (AI)" })
    );

    expect(onRemoveBg).toHaveBeenCalledTimes(1);
  });

  it("wywołuje onUpscale po kliknięciu przycisku upscalingu", async () => {
    const { user, onUpscale } = setup();

    await user.click(
      screen.getByRole("button", { name: "Upscaluj obraz" })
    );

    expect(onUpscale).toHaveBeenCalledTimes(1);
  });

  it("blokuje przyciski, gdy busy = true", () => {
    setup({ busy: true });

    expect(
      screen.getByRole("button", { name: "Usuń tło (AI)" })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Upscaluj obraz" })
    ).toBeDisabled();
  });
});
