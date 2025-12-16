import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { ConvertEmptyState } from "../ConvertEmptyState";


vi.mock("@/features/convert/components/UploadArea", () => ({
  default: () => <div>UPLOAD_AREA</div>,
}));

vi.mock("@/features/convert/components/ErrorAlert", () => ({
  ErrorAlert: ({ message }: { message: string | null }) =>
    message ? <div>ERROR: {message}</div> : null,
}));


describe("Komponent ConvertEmptyState", () => {
  it("wyświetla instrukcję krok po kroku oraz komunikat o braku plików", () => {
    render(
      <ConvertEmptyState
        addFiles={vi.fn()}
        inputRef={{ current: null }}
        error={null}
      />
    );

    expect(
      screen.getByText("Dodaj pliki")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Ustaw formaty")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Konwertuj")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Gotowe!")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Brak plików do wyświetlenia.")
    ).toBeInTheDocument();
  });

  it("renderuje obszar dodawania plików", () => {
    render(
      <ConvertEmptyState
        addFiles={vi.fn()}
        inputRef={{ current: null }}
        error={null}
      />
    );

    expect(
      screen.getByText("UPLOAD_AREA")
    ).toBeInTheDocument();
  });

  it("wyświetla komunikat błędu, gdy error jest ustawiony", () => {
    render(
      <ConvertEmptyState
        addFiles={vi.fn()}
        inputRef={{ current: null }}
        error="Błąd pliku"
      />
    );

    expect(
      screen.getByText("ERROR: Błąd pliku")
    ).toBeInTheDocument();
  });
});
