import { afterEach, beforeEach, expect, test, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import App from "./App";
import type { Product } from "./types/catalog";

// Isolated API fixtures only: production always uses the existing catalog API.
const products: Product[] = [
  {
    id: 1,
    name: "Clavier",
    description: "Un clavier compact",
    price: 250,
    stock: 4,
    shop: { id: 1, name: "Boutique A", sellerId: 1 },
    category: { id: 1, name: "Tech" },
  },
  {
    id: 2,
    name: "Lampe",
    description: null,
    price: 120,
    stock: 0,
    shop: { id: 2, name: "Boutique B", sellerId: 2 },
    category: { id: 2, name: "Maison" },
  },
];
const fetchMock = vi.fn();
function mount(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}
beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("scrollTo", vi.fn());
  fetchMock.mockResolvedValue({ ok: true, json: async () => products });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

test("catalogue: API existante, filtre, tri et remise a zero", async () => {
  mount("/products");
  await screen.findByRole("heading", { name: "Clavier" });
  expect(fetchMock).toHaveBeenCalledWith("/api/catalog/products");
  fireEvent.change(screen.getByLabelText("Trier les produits"), {
    target: { value: "price-asc" },
  });
  expect(
    within(screen.getAllByRole("article")[0]).getByRole("heading"),
  ).toHaveTextContent("Lampe");
  fireEvent.click(screen.getByLabelText("En stock uniquement"));
  expect(
    screen.queryByRole("heading", { name: "Lampe" }),
  ).not.toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: /initialiser les filtres/ }),
  );
  expect(screen.getAllByRole("article")).toHaveLength(2);
  fireEvent.change(screen.getByLabelText(/Cat.gorie/), {
    target: { value: "Maison" },
  });
  expect(
    screen.queryByRole("heading", { name: "Clavier" }),
  ).not.toBeInTheDocument();
});

test("recherche et filtres sont restaures depuis URL", async () => {
  mount("/products?q=clavier&category=Tech&available=true");
  await screen.findByRole("heading", { name: "Clavier" });
  expect(screen.getByRole("searchbox")).toHaveValue("clavier");
  expect(screen.getByLabelText("En stock uniquement")).toBeChecked();
  expect(
    screen.queryByRole("heading", { name: "Lampe" }),
  ).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "introuvable" },
  });
  expect(
    screen.getByRole("heading", { name: "Aucun produit ne correspond" }),
  ).toBeInTheDocument();
});

test("catalogue: erreur API puis nouvelle tentative", async () => {
  fetchMock.mockResolvedValueOnce({ ok: false });
  mount("/products");
  expect(await screen.findByRole("alert")).toHaveTextContent(
    /Impossible de charger/,
  );
  fireEvent.click(screen.getByRole("button", { name: /essayer/ }));
  await screen.findByRole("heading", { name: "Clavier" });
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test("catalogue vide sans donnees de remplacement", async () => {
  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => [] });
  mount("/products");
  await screen.findByRole("heading", {
    name: "Le catalogue attend ses premiers produits",
  });
  expect(screen.queryByRole("article")).not.toBeInTheDocument();
});

test("fiche produit: API, prix, stock et lien panier", async () => {
  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => products[0] });
  mount("/products/1");
  await screen.findByRole("heading", { name: "Clavier" });
  expect(fetchMock).toHaveBeenCalledWith("/api/catalog/products/1");
  expect(screen.getByText("Un clavier compact")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Consulter mon panier" }),
  ).toHaveAttribute("href", "/cart");
});

test("fiche produit: identifiant invalide sans appel API", () => {
  mount("/products/invalide");
  expect(
    screen.getByRole("heading", { name: "Identifiant de produit invalide." }),
  ).toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();
});

test("fiche produit: erreurs et rechargement", async () => {
  fetchMock.mockRejectedValueOnce(new Error("offline"));
  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => products[0] });
  mount("/products/1");
  await screen.findByRole("alert");
  fireEvent.click(screen.getByRole("button", { name: /essayer/ }));
  await screen.findByRole("heading", { name: "Clavier" });
});

test("changement de fiche: une ancienne reponse ne remplace pas le produit courant", async () => {
  let resolveFirst!: (value: unknown) => void;
  fetchMock.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveFirst = resolve;
      }),
  );
  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => products[1] });
  function SwitchProduct() {
    const navigate = useNavigate();
    return <button onClick={() => navigate("/products/2")}>Suivant</button>;
  }
  render(
    <MemoryRouter initialEntries={["/products/1"]}>
      <SwitchProduct />
      <App />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Suivant" }));
  await screen.findByRole("heading", { name: "Lampe" });
  await act(async () => {
    resolveFirst({ ok: true, json: async () => products[0] });
  });
  expect(
    screen.queryByRole("heading", { name: "Clavier" }),
  ).not.toBeInTheDocument();
  expect(screen.getByText("Rupture de stock")).toBeInTheDocument();
});

test.each([
  ["/orders", "Mes commandes"],
  ["/notifications", "Mes notifications"],
  ["/seller", "Espace vendeur"],
])("route %s conserve son contenu", (path, heading) => {
  mount(path);
  expect(
    screen.getByRole("heading", { name: heading, level: 1 }),
  ).toBeInTheDocument();
});

test("menu mobile: ouverture et fermeture apres navigation", () => {
  mount("/");
  fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
  const nav = screen.getByRole("navigation", { name: "Navigation mobile" });
  expect(nav).not.toHaveAttribute("hidden");
  fireEvent.click(within(nav).getByRole("link", { name: "Commandes" }));
  expect(
    screen.getByRole("heading", { name: "Mes commandes" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Ouvrir le menu" }),
  ).toHaveAttribute("aria-expanded", "false");
});
