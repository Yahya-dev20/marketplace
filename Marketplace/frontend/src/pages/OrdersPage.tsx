import { useEffect, useState } from "react";
import { Link } from "react-router";
import PageHeading from "../components/PageHeading";
import { DEMO_USER_ID } from "../services/cartApi";
import { getOrders, type Order } from "../services/orderApi";
import { formatPrice } from "../utils/format";
import { formatOrderDate, orderStatusLabel } from "../utils/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>();
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getOrders(DEMO_USER_ID)
      .then((result) => {
        if (active) setOrders(result.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id));
      })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);

  return (
    <>
      <PageHeading eyebrow="VOTRE ESPACE ACHATS" title="Mes commandes"
        description="Consultez l’historique et le statut de vos commandes." />
      <section className="panel order-panel">
        {error && <p role="alert">Impossible de charger les commandes.</p>}
        {!orders && !error && <p role="status">Chargement des commandes…</p>}
        {orders?.length === 0 && <p>Vous n’avez encore passé aucune commande.</p>}
        {orders && orders.length > 0 && (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <Link to={`/orders/${order.id}`}>Commande n° {order.id}</Link>
                {" · "}<time dateTime={order.createdAt}>{formatOrderDate(order.createdAt)}</time>
                {" · "}{orderStatusLabel[order.status]}{" · "}{formatPrice(order.total)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
