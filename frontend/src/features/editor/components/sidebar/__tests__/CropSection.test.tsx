import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CropSection from "../CropSection";

vi.mock("../SectionShell", () => ({
  default: ({ title, children }: any) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
}));

const setup = (props?: Partial<React.ComponentProps<typeof CropSection>>) => {
  const defaults = {
    busy: false,
    cropEnabled: false,
    onStartCrop: vi.fn(),
    onApplyCrop: vi.fn(),
    onCancelCrop: vi.fn(),
    openIds: new Set<string>(["crop"]),
    toggle: vi.fn(),
  };

  render(<CropSection {...defaults} {...props} />);

  return {
    ...defaults,
    ...props,
  };
};

describe("Komponent CropSection", () => {
  it("renderuje nagłówek sekcji", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Kadrowanie" })
    ).toBeInTheDocument();
  });

  it("pokazuje przycisk Przytnij gdy kadrowanie jest wyłączone", () => {
    setup({ cropEnabled: false });

    expect(
      screen.getByRole("button", { name: "Przytnij" })
    ).toBeInTheDocument();
  });

  it("wywołuje onStartCrop po kliknięciu Przytnij", () => {
    const { onStartCrop } = setup({ cropEnabled: false });

    fireEvent.click(
      screen.getByRole("button", { name: "Przytnij" })
    );

    expect(onStartCrop).toHaveBeenCalledTimes(1);
  });

  it("pokazuje przyciski anuluj i zastosuj gdy kadrowanie jest aktywne", () => {
    setup({ cropEnabled: true });

    expect(
      screen.getByLabelText("Anuluj kadrowanie")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Zastosuj kadrowanie")
    ).toBeInTheDocument();
  });

  it("wywołuje onCancelCrop po kliknięciu anuluj", () => {
    const { onCancelCrop } = setup({ cropEnabled: true });

    fireEvent.click(
      screen.getByLabelText("Anuluj kadrowanie")
    );

    expect(onCancelCrop).toHaveBeenCalledTimes(1);
  });

  it("wywołuje onApplyCrop po kliknięciu zastosuj", () => {
    const { onApplyCrop } = setup({ cropEnabled: true });

    fireEvent.click(
      screen.getByLabelText("Zastosuj kadrowanie")
    );

    expect(onApplyCrop).toHaveBeenCalledTimes(1);
  });

  it("blokuje przyciski gdy busy = true", () => {
    setup({ cropEnabled: false, busy: true });

    expect(
      screen.getByRole("button", { name: "Przytnij" })
    ).toBeDisabled();
  });
});
