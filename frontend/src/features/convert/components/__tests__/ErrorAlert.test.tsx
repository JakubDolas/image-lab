import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ErrorAlert } from "../ErrorAlert";

describe("Komponent ErrorAlert", () => {
  it("wyświetla komunikat błędu, gdy message jest ustawione", () => {
    render(<ErrorAlert message="Wystąpił błąd" />);

    expect(
      screen.getByText("Wystąpił błąd")
    ).toBeInTheDocument();
  });

  it("nie renderuje nic, gdy message jest null", () => {
    const { container } = render(
      <ErrorAlert message={null} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
