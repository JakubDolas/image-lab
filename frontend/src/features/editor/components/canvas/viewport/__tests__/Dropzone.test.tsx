import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Dropzone } from "../Dropzone";

describe("Komponent Dropzone", () => {
  it("renderuje przekazane children", () => {
    const { getByText } = render(
      <Dropzone onPickFile={vi.fn()}>
        <div>Testowa zawartość</div>
      </Dropzone>
    );

    expect(getByText("Testowa zawartość")).toBeInTheDocument();
  });

  it("wywołuje onPickFile po upuszczeniu pliku", () => {
    const onPickFile = vi.fn();

    const { container } = render(
      <Dropzone onPickFile={onPickFile}>
        <div>Drop here</div>
      </Dropzone>
    );

    const file = new File(["test"], "test.png", { type: "image/png" });

    fireEvent.drop(container.firstChild as Element, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(onPickFile).toHaveBeenCalledTimes(1);
    expect(onPickFile).toHaveBeenCalledWith(file);
  });

  it("nie wywołuje onPickFile, gdy brak pliku", () => {
    const onPickFile = vi.fn();

    const { container } = render(
      <Dropzone onPickFile={onPickFile}>
        <div>Drop here</div>
      </Dropzone>
    );

    fireEvent.drop(container.firstChild as Element, {
      dataTransfer: {
        files: [],
      },
    });

    expect(onPickFile).not.toHaveBeenCalled();
  });
});
