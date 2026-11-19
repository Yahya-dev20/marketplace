import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import OrderSummary from "../components/OrderSummary";
import PageHeading from "../components/PageHeading";
import { DEMO_USER_ID } from "../services/cartApi";
import { getOrder, simulatePayment, type Order } from "../services/orderApi";
import { formatOrderDate, orderStatusLabel } from "../utils/order";

function OrderDetails({ id }: { id: string }) {
  const [order, setOrder] = useState<Order>();
  const [error, setError] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [paying, setPaying] = useState(false);
  const paymentInProgress = useRef(false);
  const { state } = useLocation();

  useEffect(() => {
    let active = true;
    getOrder(id)
      .then((result) => {
        if (!active) return;
        if (result.userId === DEMO_USER_ID) setOrder(result);
        else setError(true);
      })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [id]);

  async function pay(success: boolean) {
    if (!order || order.status !== "PENDING_PAYMENT" || paymentInProgress.current) return;
    paymentInProgress.current = true;
    setPaying(true);
    setPaymentError(false);
    try {
      setOrder(await simulatePayment(order.id, success));
    } catch {
      setPaymentError(true);
      try {
        const latest = await getOrder(id);
        if (latest.status !== "PENDING_PAYMENT") {
          setOrder(latest);
          setPaymentError(false);
        }
      } catch {
        // Preserve the current order and the error when the service is unreachable.
      }
    } finally {
      paymentInProgress.current = false;
      setPaying(false);
    }
  }

  return (
    <>
      <PageHeading eyebrow="MES COMMANDES" title={`Commande n° ${id}`}
        description="Détail des articles et statut de la commande." />
      <section className="panel order-panel">
        {state?.createdOrderId?.toString() === id && <p role="status">Commande créée.</p>}
        {error && <p role="alert">Commande indisponible.</p>}
        {!order && !error && <p role="status">Chargement de la commande…</p>}
        {order && (
          <>
            <p>{orderStatusLabel[order.status]} · <time dateTime={order.createdAt}>{formatOrderDate(order.createdAt)}</time></p>
            <OrderSummary items={order.items} total={order.total} />
            {order.status === "PENDING_PAYMENT" && (
              <div className="order-controls">
                <h2>Paiement simulé</h2>
                <div className="detail-actions">
                  <button type="button" className="btn" disabled={paying} onClick={() => pay(true)}>
                    Simuler un paiement accepté
                  </button>
                  <button type="button" className="btn" disabled={paying} onClick={() => pay(false)}>
                    Simuler un paiement refusé
                  </button>
                </div>
                {paying && <p role="status">Traitement du paiement…</p>}
                {paymentError && <p role="alert">Impossible de confirmer le résultat du paiement.</p>}
              </div>
            )}
          </>
        )}
        <p><Link to="/orders">Retour à mes commandes</Link></p>
      </section>
    </>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  if (!id || !/^[1-9]\d*$/.test(id)) return <p role="alert">Numéro de commande invalide.</p>;
  return <OrderDetails key={id} id={id} />;
}
