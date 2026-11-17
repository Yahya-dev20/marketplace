export function formatPrice(price: number) {
  return `${price.toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`;
}
