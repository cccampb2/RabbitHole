import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

it("renders the main heading", () => {
  render(<App />);
  const heading = screen.getByRole("heading", { level: 1 });
  const brandedText = screen.getByText("bit", { exact: true });
  expect(brandedText).toHaveClass("text-brand");
  expect(heading).toHaveTextContent("RabbitHole");
});
