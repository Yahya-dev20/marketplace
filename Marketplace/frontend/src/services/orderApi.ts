import type { CartItem } from "../types/cart";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PAYMENT_FAILED"
  | "SHIPPED"
  | "DELIVERED";

export type Order = {
  id: number;
  userId: number;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: CartItem[];
};

const API = "/api/orders";

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`Erreur commandes HTTP ${response.status}`);
  return response.json();
}

export async function checkout(userId: number): Promise<Order> {
  return readResponse(await fetch(`${API}/checkout/${userId}`, { method: "POST" }));
}

export async function getOrders(userId: number): Promise<Order[]> {
  return readResponse(await fetch(`${API}/users/${userId}`));
}

export async function getOrder(id: string): Promise<Order> {
  return readResponse(await fetch(`${API}/${encodeURIComponent(id)}`));
}

export async function simulatePayment(id: number, success: boolean): Promise<Order> {
  return readResponse(await fetch(`${API}/${id}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success }),
  }));
}
