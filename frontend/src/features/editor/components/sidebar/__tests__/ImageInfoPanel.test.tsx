import { render, screen } from "@testing-library/react";
import ImageInfoPanel from "../ImageInfoPanel";

describe("ImageInfoPanel", () => {
  it("nie renderuje się, gdy info = null", () => {
    const { container } = render(<ImageInfoPanel info={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renderuje nagłówek panelu", () => {
    render(
      <ImageInfoPanel
        info={{ width: 800, height: 600 }}
      />
    );

    expect(
      screen.getByText("Informacje o obrazie")
    ).toBeInTheDocument();
  });

  it("wyświetla wymiary obrazu", () => {
    render(
      <ImageInfoPanel
        info={{ width: 1920, height: 1080 }}
      />
    );

    expect(
      screen.getByText("1920 × 1080 px")
    ).toBeInTheDocument();
  });

  it("wyświetla format obrazu", () => {
    render(
      <ImageInfoPanel
        info={{ format: "JPEG" }}
      />
    );

    expect(screen.getByText("JPEG")).toBeInTheDocument();
  });

  it("wyświetla rozmiar pliku w KB", () => {
    render(
      <ImageInfoPanel
        info={{ sizeBytes: 2048 }}
      />
    );

    expect(screen.getByText("2 KB")).toBeInTheDocument();
  });

  it("wyświetla rozmiar pliku w MB", () => {
    render(
      <ImageInfoPanel
        info={{ sizeBytes: 2_500_000 }}
      />
    );

    expect(screen.getByText("2.4 MB")).toBeInTheDocument();
  });

  it("wyświetla przestrzeń kolorów", () => {
    render(
      <ImageInfoPanel
        info={{ colorSpace: "RGB" }}
      />
    );

    expect(screen.getByText("RGB")).toBeInTheDocument();
  });

  it("nie renderuje brakujących pól", () => {
    render(
      <ImageInfoPanel
        info={{ format: "PNG" }}
      />
    );

    expect(screen.queryByText("Wymiary")).not.toBeInTheDocument();
    expect(screen.queryByText("Rozmiar")).not.toBeInTheDocument();
  });
});
