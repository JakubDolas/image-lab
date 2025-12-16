import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import UploadArea from "../UploadArea";

describe("Komponent UploadArea", () => {
  it("wyświetla instrukcję oraz przycisk wyboru plików", () => {
    render(<UploadArea onFiles={vi.fn()} />);

    expect(
      screen.getByText("Przeciągnij i upuść pliki tutaj")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Wybierz z dysku" })
    ).toBeInTheDocument();
  });

  it("wywołuje onFiles po wybraniu plików z dysku", () => {
    const onFiles = vi.fn();
    render(<UploadArea onFiles={onFiles} />);

    const file = new File(["abc"], "test.png", {
      type: "image/png",
    });

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it("kliknięcie przycisku powoduje kliknięcie inputa pliku", async () => {
    const user = userEvent.setup();
    render(<UploadArea onFiles={vi.fn()} />);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const clickSpy = vi.spyOn(input, "click");

    await user.click(
      screen.getByRole("button", { name: "Wybierz z dysku" })
    );

    expect(clickSpy).toHaveBeenCalled();
  });
});
