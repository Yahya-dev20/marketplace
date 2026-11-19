import type { CartItem } from "../types/cart";
import type { Category, Product, Shop } from "../types/catalog";
import type { OrderStatus } from "./orderApi";

export type Seller = { id: number; name: string; role: "SELLER" };
export type SellerSession = { token: string; seller: Seller };
export type SellerOrder = {
  id: number;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  total: number;
};
type ProductInput = {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  shopId: number;
  categoryId: number;
};

async function request<T>(path: string, { method = "GET", body, token }: {
  method?: string;
  body?: object;
  token?: string;
} = {}): Promise<T> {
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const multipart = body instanceof FormData;
  if (body && !multipart) headers.set("Content-Type", "application/json");
  const response = await fetch(`/api/${path}`, {
    method, headers, body: multipart ? body : body && JSON.stringify(body),
  });
  if (response.status === 401) throw new Error("Identifiants invalides ou session expirée.");
  if (response.status === 403) throw new Error("Vous n’avez pas accès à cette ressource.");
  if (response.status === 409) throw new Error("Cette adresse e-mail est déjà utilisée.");
  if (response.status === 413) throw new Error("La photo dépasse 5 Mo.");
  if (response.status === 400) throw new Error("Vérifiez les champs et le format de la photo.");
  if (!response.ok) throw new Error("Impossible d’enregistrer ou de charger les données.");
  if (response.status === 204) return undefined as T;
  return response.json();
}

const AUTH = "users/seller-auth";

export function createSeller(name: string, email: string, password: string) {
  return request<SellerSession>(`${AUTH}/register`, { method: "POST", body: { name, email, password } });
}

export function loginSeller(email: string, password: string) {
  return request<SellerSession>(`${AUTH}/login`, { method: "POST", body: { email, password } });
}

export function getSeller(token: string) {
  return request<Seller>(`${AUTH}/session`, { token });
}

export function logoutSeller(token: string) {
  return request<void>(`${AUTH}/session`, { method: "DELETE", token });
}

export function getSellerShops(token: string) {
  return request<Shop[]>("catalog/seller/shops", { token });
}

export function createShop(token: string, sellerId: number, name: string) {
  return request<Shop>("catalog/shops", { method: "POST", body: { sellerId, name }, token });
}

export function getCategories() {
  return request<Category[]>("catalog/categories");
}

export function getShopProducts(shopId: number) {
  return request<Product[]>(`catalog/shops/${shopId}/products`);
}

export function createProduct(token: string, input: ProductInput, image?: File) {
  const body = new FormData();
  body.set("product", new Blob([JSON.stringify(input)], { type: "application/json" }));
  if (image) body.set("image", image);
  return request<Product>("catalog/seller/products", { method: "POST", token, body });
}

export function updateStock(token: string, productId: number, stock: number) {
  return request<Product>(`catalog/seller/products/${productId}/stock`, {
    method: "PATCH", token, body: { stock },
  });
}

export function getSellerOrders(token: string) {
  return request<SellerOrder[]>("orders/seller", { token });
}
