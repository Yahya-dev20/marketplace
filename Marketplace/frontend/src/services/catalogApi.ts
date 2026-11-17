import type { Product } from "../types/catalog";

const API = "/api/catalog";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API}/products`);

  if (!response.ok) {
    throw new Error("Impossible de charger les produits");
  }

  return response.json();
}

export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`${API}/products/${id}`);

  if (!response.ok) {
    throw new Error("Produit introuvable");
  }

  return response.json();
}
