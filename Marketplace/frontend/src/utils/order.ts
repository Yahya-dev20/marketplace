import type { OrderStatus } from "../services/orderApi";

export const orderStatusLabel: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payée",
  PAYMENT_FAILED: "Paiement échoué",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
};

export function formatOrderDate(date: string) {
  return new Date(date).toLocaleString("fr-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
