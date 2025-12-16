import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { ConvertToolbar } from "../ConvertToolbar";

describe("Komponent ConvertToolbar", () => {
  it("wyświetla przycisk dodawania plików", () => {
    render(
      <ConvertToolbar
        openAddDialog={vi.fn()}
        clearAll={vi.fn()}
        inputRef={{ current: null }}
        addFiles={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "+ Dodaj" })
    ).toBeInTheDocument();
  });

  it("wywołuje openAddDialog po kliknięciu przycisku '+ Dodaj'", async () => {
    const user = userEvent.setup();
    const openAddDialog = vi.fn();

    render(
      <ConvertToolbar
        openAddDialog={openAddDialog}
        clearAll={vi.fn()}
        inputRef={{ current: null }}
        addFiles={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "+ Dodaj" })
    );

    expect(openAddDialog).toHaveBeenCalled();
  });

  it("wywołuje clearAll po kliknięciu przycisku 'Usuń wszystkie'", async () => {
    const user = userEvent.setup();
    const clearAll = vi.fn();

    render(
      <ConvertToolbar
        openAddDialog={vi.fn()}
        clearAll={clearAll}
        inputRef={{ current: null }}
        addFiles={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Usuń wszystkie" })
    );

    expect(clearAll).toHaveBeenCalled();
  });
});
