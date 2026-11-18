import userEvent from "@testing-library/user-event";
import { it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import SiteHeader from "./SiteHeader";

it("opens the Algorithms dropdown", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>,
  );

  const button = screen.getByRole("button", { name: "Algorithms" });
  expect(
    screen.queryByRole("link", { name: "Sorting" }),
  ).not.toBeInTheDocument();
  await user.click(button);
  const sortingLink = screen.getByRole("link", { name: "Sorting" });
  expect(sortingLink).toBeInTheDocument();
});

it("closes the Algorithms dropdown when its button is clicked again", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>,
  );

  const button = screen.getByRole("button", { name: "Algorithms" });

  await user.click(button);
  const sortingLink = screen.getByRole("link", { name: "Sorting" });
  expect(sortingLink).toBeInTheDocument();
  await user.click(button);
  expect(
    screen.queryByRole("link", { name: "Sorting" }),
  ).not.toBeInTheDocument();
});

it("closes the dropdown when clicking outside the navbar", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>,
  );

  const button = screen.getByRole("button", { name: "Algorithms" });

  await user.click(button);
  const sortingLink = screen.getByRole("link", { name: "Sorting" });
  expect(sortingLink).toBeInTheDocument();
  await user.click(document.body);
  expect(
    screen.queryByRole("link", { name: "Sorting" }),
  ).not.toBeInTheDocument();
});

it("closes the dropdown with Escape and returns focus to its button", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>,
  );

  const button = screen.getByRole("button", { name: "Algorithms" });

  await user.click(button);
  const sortingLink = screen.getByRole("link", { name: "Sorting" });
  await user.tab();
  expect(sortingLink).toHaveFocus();
  await user.keyboard("{Escape}");
  expect(
    screen.queryByRole("link", { name: "Sorting" }),
  ).not.toBeInTheDocument();
  expect(button).toHaveFocus();
});

it("switches dropdowns when another menu is opened", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>,
  );

  const button = screen.getByRole("button", { name: "Algorithms" });
  await user.click(button);
  const sortingLink = screen.getByRole("link", { name: "Sorting" });
  expect(sortingLink).toBeInTheDocument();
  const dataButton = screen.getByRole("button", { name: "Data Structures" });
  await user.click(dataButton);
  const arrayLink = screen.getByRole("link", { name: "Arrays" });
  expect(arrayLink).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "Sorting" }),
  ).not.toBeInTheDocument();
});

it("closes the dropdown after selecting a page", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>,
  );

  const button = screen.getByRole("button", { name: "Algorithms" });
  await user.click(button);

  const sortingLink = screen.getByRole("link", { name: "Sorting" });
  expect(sortingLink).toHaveAttribute("href", "/algorithms/sorting");

  await user.click(sortingLink);

  expect(
    screen.queryByRole("link", { name: "Sorting" }),
  ).not.toBeInTheDocument();
});

it("open the mobile menu navigation", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>,
  );
  const button = screen.getByRole("button", { name: "Open navigation" });
  expect(
    screen.queryByRole("link", { name: "Contribute on GitHub" }),
  ).not.toBeInTheDocument();
  await user.click(button);
  expect(
    screen.getByRole("link", { name: "Contribute on GitHub" }),
  ).toBeInTheDocument();
  expect(button).toHaveAttribute("aria-expanded", "true");
});

it("closes mobile navigation with Escape and restores focus", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>,
  );

  const button = screen.getByRole("button", { name: "Open navigation" });
  await user.click(button);

  expect(
    screen.queryByRole("link", { name: "Contribute on GitHub" }),
  ).toBeInTheDocument();
  await user.tab();
  expect(button).not.toHaveFocus();
  await user.keyboard("{Escape}");
  expect(
    screen.queryByRole("link", { name: "Contribute on GitHub" }),
  ).not.toBeInTheDocument();
  expect(button).toHaveFocus();
  expect(button).toHaveAttribute("aria-expanded", "false");
});

it("closes mobile navigation when clicking outside", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>,
  );

  const button = screen.getByRole("button", { name: "Open navigation" });
  await user.click(button);
  expect(
    screen.queryByRole("link", { name: "Contribute on GitHub" }),
  ).toBeInTheDocument();
  await user.click(document.body);
  expect(
    screen.queryByRole("link", { name: "Contribute on GitHub" }),
  ).not.toBeInTheDocument();
  expect(button).toHaveAttribute("aria-expanded", "false");
});

it("closes mobile navigation after selecting a page", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>,
  );

  const button = screen.getByRole("button", { name: "Open navigation" });
  await user.click(button);
  const panel = document.getElementById("mobile-navigation");
  if (!panel) throw new Error("Mobile panel did not open");

  const mobile = within(panel);
  await user.click(mobile.getByRole("button", { name: "Algorithms" }));
  const sorting = mobile.getByRole("link", { name: "Sorting" });
  await user.click(sorting);
  expect(
    screen.queryByRole("link", { name: "Contribute on GitHub" }),
  ).not.toBeInTheDocument();
  expect(button).toHaveAttribute("aria-expanded", "false");
});
