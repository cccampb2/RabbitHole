import { it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router";

it("renders the main heading", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );
  const heading = screen.getByRole("heading", { level: 1 });
  const brandedText = within(heading).getByText("bit", { exact: true });
  expect(brandedText).toHaveClass("text-brand");
  expect(heading).toHaveTextContent("RabbitNotation");
});

it("shows a not-found page for an unknown URL", () => {
  render(
    <MemoryRouter initialEntries={["/this-page-does-not-exist"]}>
      <App />
    </MemoryRouter>,
  );
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toHaveTextContent("Page not found");
});

it("renders the algorithms directory at /algorithms", () => {
  render(
    <MemoryRouter initialEntries={["/algorithms"]}>
      <App />
    </MemoryRouter>,
  );

  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toHaveTextContent("Algorithms");
});
