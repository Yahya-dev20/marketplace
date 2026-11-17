import PageHeading from "../components/PageHeading";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
export default function NotificationsPage() {
  return (
    <>
      <PageHeading
        eyebrow="RESTEZ INFORMÉ"
        title="Mes notifications"
        description="Les événements liés à vos commandes, réunis au même endroit."
      />
      <section className="panel">
        <div className="panel-heading">
          <h2>Centre de notifications</h2>
          <Icon name="bell" />
        </div>
        <EmptyState
          icon="bell"
          title="Votre fil d’actualité se prépare"
          description="Cet espace accueillera les informations et les mises à jour de vos commandes."
        >
          <p className="service-notice">
            Le service notifications n’est pas encore connecté. Les événements
            seront affichés après son activation.
          </p>
        </EmptyState>
      </section>
    </>
  );
}
