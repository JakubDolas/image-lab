import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import FormatGrid from "../components/FormatGrid";
import { groupFormats } from "@/features/convert/components/lib/classifyFormats";

vi.mock(
  "@/features/convert/components/lib/classifyFormats",
  () => ({
    groupFormats: vi.fn(),
  })
);


const labelMap = {
  png: "PNG",
  jpg: "JPG",
  webp: "WEBP",
  tiff: "TIFF",
};

const baseGroups = [
  {
    name: "Obraz",
    items: ["png", "jpg"],
  },
];

const advancedGroups = [
  {
    name: "Naukowe/specjalistyczne",
    items: ["tiff"],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("Komponent FormatGrid", () => {
  it("wyświetla nagłówek oraz podstawowe formaty", () => {
    (groupFormats as any).mockReturnValue(baseGroups);

    render(
      <FormatGrid
        current="png"
        onPick={vi.fn()}
        availableFormats={["png", "jpg"]}
        labelMap={labelMap}
      />
    );

    expect(
      screen.getByText("Wybierz format")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "PNG" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "JPG" })
    ).toBeInTheDocument();
  });

  it("wywołuje onPick po kliknięciu formatu", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();

    (groupFormats as any).mockReturnValue(baseGroups);

    render(
      <FormatGrid
        current="png"
        onPick={onPick}
        availableFormats={["png", "jpg"]}
        labelMap={labelMap}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "JPG" })
    );

    expect(onPick).toHaveBeenCalledWith("jpg");
  });

  it("oznacza aktualnie wybrany format jako aktywny", () => {
    (groupFormats as any).mockReturnValue(baseGroups);

    render(
      <FormatGrid
        current="png"
        onPick={vi.fn()}
        availableFormats={["png", "jpg"]}
        labelMap={labelMap}
      />
    );

    const activeBtn = screen.getByRole("button", {
      name: "PNG",
    });

    expect(activeBtn.className).toContain(
      "bg-indigo-600"
    );
  });

  it("nie pokazuje sekcji zaawansowanej, gdy brak formatów specjalistycznych", () => {
    (groupFormats as any).mockReturnValue(baseGroups);

    render(
      <FormatGrid
        current="png"
        onPick={vi.fn()}
        availableFormats={["png", "jpg"]}
        labelMap={labelMap}
      />
    );

    expect(
      screen.queryByText(/Pokaż więcej formatów/i)
    ).not.toBeInTheDocument();
  });

  it("pozwala rozwinąć i zwinąć formaty specjalistyczne", async () => {
    const user = userEvent.setup();

    (groupFormats as any).mockReturnValue([
      ...baseGroups,
      ...advancedGroups,
    ]);

    render(
      <FormatGrid
        current="png"
        onPick={vi.fn()}
        availableFormats={["png", "jpg", "tiff"]}
        labelMap={labelMap}
      />
    );

    const toggle = screen.getByRole("button", {
      name: /Pokaż więcej formatów/i,
    });

    expect(toggle).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    await user.click(toggle);

    expect(
      screen.getByRole("button", { name: "TIFF" })
    ).toBeInTheDocument();

    expect(toggle).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("zapamiętuje stan rozwinięcia w localStorage", async () => {
    const user = userEvent.setup();

    (groupFormats as any).mockReturnValue([
      ...baseGroups,
      ...advancedGroups,
    ]);

    render(
      <FormatGrid
        current="png"
        onPick={vi.fn()}
        availableFormats={["png", "jpg", "tiff"]}
        labelMap={labelMap}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /Pokaż więcej formatów/i,
      })
    );

    expect(
      localStorage.getItem("fmt_show_advanced")
    ).toBe("1");
  });

  it("nie zapamiętuje stanu rozwinięcia, gdy rememberExpanded=false", async () => {
    const user = userEvent.setup();

    (groupFormats as any).mockReturnValue([
      ...baseGroups,
      ...advancedGroups,
    ]);

    render(
      <FormatGrid
        current="png"
        onPick={vi.fn()}
        availableFormats={["png", "jpg", "tiff"]}
        labelMap={labelMap}
        rememberExpanded={false}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /Pokaż więcej formatów/i,
      })
    );

    expect(
      localStorage.getItem("fmt_show_advanced")
    ).toBeNull();
  });
});
