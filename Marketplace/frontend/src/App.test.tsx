import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "./App";

test("affiche la page accueil", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("heading", {
      name: "Découvrez notre marketplace multi-vendeurs",
    }),
  ).toBeInTheDocument();
});

test("affiche la page panier", () => {
  render(
    <MemoryRouter initialEntries={["/cart"]}>
      <App />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("heading", { name: "Mon panier" }),
  ).toBeInTheDocument();
});

test("affiche une page 404", () => {
  render(
    <MemoryRouter initialEntries={["/page-inexistante"]}>
      <App />
    </MemoryRouter>,
  );

  expect(screen.getByText("404 — Page introuvable")).toBeInTheDocument();
});
