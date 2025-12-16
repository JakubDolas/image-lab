import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import ActionBar from "../ActionBar";

describe("Komponent ActionBar", () => {
  it("umożliwia rozpoczęcie konwersji, gdy canStart=true", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(
      <ActionBar
        canStart={true}
        canDownload={false}
        onStart={onStart}
        onDownload={vi.fn()}
        busy={false}
      />
    );

    const startBtn = screen.getByRole("button", {
      name: "Konwertuj wszystko",
    });

    expect(startBtn).toBeEnabled();

    await user.click(startBtn);

    expect(onStart).toHaveBeenCalled();
  });

  it("blokuje przycisk startu i pokazuje tekst „Przetwarzanie…”, gdy busy=true", () => {
    render(
      <ActionBar
        canStart={true}
        canDownload={false}
        onStart={vi.fn()}
        onDownload={vi.fn()}
        busy={true}
      />
    );

    expect(
      screen.getByText("Przetwarzanie...")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Przetwarzanie..." })
    ).toBeDisabled();
  });

  it("umożliwia pobranie plików, gdy canDownload=true", async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    render(
      <ActionBar
        canStart={false}
        canDownload={true}
        onStart={vi.fn()}
        onDownload={onDownload}
        busy={false}
      />
    );

    const downloadBtn = screen.getByRole("button", {
      name: "Pobierz",
    });

    expect(downloadBtn).toBeEnabled();

    await user.click(downloadBtn);

    expect(onDownload).toHaveBeenCalled();
  });

  it("blokuje przycisk pobierania, gdy canDownload=false", () => {
    render(
      <ActionBar
        canStart={true}
        canDownload={false}
        onStart={vi.fn()}
        onDownload={vi.fn()}
        busy={false}
      />
    );

    expect(
      screen.getByRole("button", { name: "Pobierz" })
    ).toBeDisabled();
  });
});
