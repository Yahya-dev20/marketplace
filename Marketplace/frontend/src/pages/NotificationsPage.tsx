import { useEffect, useState } from "react";
import { Link } from "react-router";
import EmptyState from "../components/EmptyState";
import PageHeading from "../components/PageHeading";
import { DEMO_USER_ID } from "../services/cartApi";
import { getNotifications, markNotificationRead, type Notification } from "../services/notificationApi";
import { formatOrderDate } from "../utils/order";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>();
  const [loadError, setLoadError] = useState(false);
  const [writeError, setWriteError] = useState(false);
  const [pending, setPending] = useState<number>();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getNotifications(DEMO_USER_ID)
      .then((result) => { if (active) setNotifications(result); })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [attempt]);

  async function markRead(id: number) {
    if (pending !== undefined) return;
    setPending(id);
    setWriteError(false);
    try {
      const updated = await markNotificationRead(id);
      setNotifications((previous) => previous?.map((notice) => notice.id === id ? updated : notice));
    } catch {
      setWriteError(true);
    } finally {
      setPending(undefined);
    }
  }

  return (
    <>
      <PageHeading eyebrow="RESTEZ INFORMÉ" title="Mes notifications"
        description="Retrouvez les mises à jour de vos commandes." />
      <section className="panel order-panel">
        {!notifications && !loadError && <p role="status">Chargement des notifications…</p>}
        {loadError && (
          <>
            <p role="alert">Impossible de charger les notifications.</p>
            <button type="button" className="btn" onClick={() => { setLoadError(false); setAttempt(attempt + 1); }}>
              Réessayer
            </button>
          </>
        )}
        {writeError && <p role="alert">Impossible de marquer la notification comme lue.</p>}
        {notifications?.length === 0 && (
          <EmptyState icon="bell" title="Aucune notification"
            description="Les mises à jour de vos commandes apparaîtront ici." />
        )}
        {notifications && notifications.length > 0 && (
          <>
            <p role="status">Non lues · {notifications.filter(({ read }) => !read).length}</p>
            <ul className="notification-list">
              {notifications.map((notice) => (
                <li key={notice.id}>
                  <p>{notice.message}</p>
                  <div className="detail-actions">
                    <time dateTime={notice.createdAt}>{formatOrderDate(notice.createdAt)}</time>
                    {notice.orderId && <Link to={`/orders/${notice.orderId}`}>Voir la commande</Link>}
                    {!notice.read && (
                      <button type="button" className="btn" disabled={pending !== undefined}
                        onClick={() => markRead(notice.id)}>
                        {pending === notice.id ? "Mise à jour…" : "Marquer comme lue"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
