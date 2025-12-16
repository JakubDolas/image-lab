import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import ConvertPage from "../convert/ConvertPage";


vi.mock("@/features/convert/components/ConvertEmptyState", () => ({
  ConvertEmptyState: () => (
    <div>EMPTY_STATE</div>
  ),
}));

vi.mock("@/features/convert/components/ConvertToolbar", () => ({
  ConvertToolbar: () => (
    <div>TOOLBAR</div>
  ),
}));

vi.mock("@/features/convert/components/FileCard/FileCard", () => ({
  default: () => (
    <div>FILE_CARD</div>
  ),
}));

vi.mock("@/features/convert/components/ActionBar", () => ({
  default: () => (
    <div>ACTION_BAR</div>
  ),
}));


vi.mock(
  "@/features/convert/components/hooks/useConversionState",
  () => ({
    useConversionState: vi.fn(),
  })
);

vi.mock(
  "@/features/convert/components/hooks/useFormats",
  () => ({
    useFormats: vi.fn(),
  })
);

import { useConversionState } from "@/features/convert/components/hooks/useConversionState";
import { useFormats } from "@/features/convert/components/hooks/useFormats";


beforeEach(() => {
  vi.clearAllMocks();

  (useFormats as any).mockReturnValue({
    availableFormats: ["png", "webp"],
    labelMap: {
      png: "PNG",
      webp: "WEBP",
    },
  });
});


describe("Strona ConvertPage", () => {
  it("wyświetla stan pusty, gdy brak plików", () => {
    (useConversionState as any).mockReturnValue({
      files: [],
      addFiles: vi.fn(),
      inputRef: { current: null },
      error: null,
    });

    render(<ConvertPage />);

    expect(
      screen.getByText("EMPTY_STATE")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("FILE_CARD")
    ).not.toBeInTheDocument();
  });

  it("wyświetla listę plików, toolbar i action bar, gdy pliki istnieją", () => {
    (useConversionState as any).mockReturnValue({
      files: [
        {
          file: new File(["a"], "a.png"),
          previewBlob: new Blob(),
        },
      ],
      formats: {},
      quality: {},
      sizes: {},
      zipBlob: null,
      busy: false,

      addFiles: vi.fn(),
      removeAt: vi.fn(),
      setFormats: vi.fn(),
      setQuality: vi.fn(),
      setSizes: vi.fn(),
      start: vi.fn(),
      download: vi.fn(),
      clearAll: vi.fn(),
      openAddDialog: vi.fn(),

      inputRef: { current: null },
    });

    render(<ConvertPage />);

    expect(
      screen.getByText("TOOLBAR")
    ).toBeInTheDocument();

    expect(
      screen.getByText("FILE_CARD")
    ).toBeInTheDocument();

    expect(
      screen.getByText("ACTION_BAR")
    ).toBeInTheDocument();
  });
});
