import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import OrderSummary from "../components/OrderSummary";
import PageHeading from "../components/PageHeading";
import { DEMO_USER_ID, getCart } from "../services/cartApi";
import { checkout } from "../services/orderApi";
import type { Cart } from "../types/cart";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart>();
  const [loadError, setLoadError] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submission = useRef(false);

  useEffect(() => {
    let active = true;
    getCart(DEMO_USER_ID)
      .then((result) => { if (active) setCart(result); })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, []);

  async function confirmOrder() {
    if (submission.current || !cart?.items.length) return;
    submission.current = true;
    setSubmitting(true);
    setSubmitError(false);

    try {
      const order = await checkout(DEMO_USER_ID);
      navigate(`/orders/${order.id}`, { replace: true, state: { createdOrderId: order.id } });
    } catch {
      setSubmitError(true);
      submission.current = false;
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeading eyebrow="MON PANIER" title="Récapitulatif de commande"
        description="Vérifiez vos articles avant de confirmer la commande." />
      <section className="panel order-panel">
        {loadError && <p role="alert">Impossible de charger le panier.</p>}
        {!cart && !loadError && <p role="status">Chargement du panier…</p>}
        {cart?.items.length === 0 && <p>Votre panier est vide.</p>}
        {cart && cart.items.length > 0 && (
          <>
            <OrderSummary items={cart.items} total={cart.total} />
            <button type="button" className="btn" disabled={submitting} onClick={confirmOrder}>
              {submitting ? "Création en cours…" : "Confirmer la commande"}
            </button>
          </>
        )}
        {submitError && (
          <p role="alert">
            Impossible de confirmer la commande. Consultez votre historique avant de réessayer.
          </p>
        )}
        {submitError && <p><Link to="/orders">Mes commandes</Link></p>}
        <p><Link to="/cart">Retour au panier</Link></p>
      </section>
    </>
  );
}
