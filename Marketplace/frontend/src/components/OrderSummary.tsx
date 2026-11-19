import type { CartItem } from "../types/cart";
import { formatPrice } from "../utils/format";

export default function OrderSummary({ items, total }: { items: CartItem[]; total: number }) {
  return (
    <>
      <ul>
        {items.map((item) => (
          <li key={item.productId}>
            {item.productName} · {item.quantity} × {formatPrice(item.unitPrice)}
            {" · "}<strong>{formatPrice(item.subtotal)}</strong>
          </li>
        ))}
      </ul>
      <div className="summary-total">
        <span>Total</span>
        <strong>{formatPrice(total)}</strong>
      </div>
    </>
  );
}
