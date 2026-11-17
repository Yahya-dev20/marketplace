import PageHeading from "../components/PageHeading";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
export default function OrdersPage() {
  return (
    <>
      <PageHeading
        eyebrow="VOTRE ESPACE ACHATS"
        title="Mes commandes"
        description="Un espace dédié à vos achats et à leur suivi."
      />
      <section className="panel">
        <div className="panel-heading">
          <h2>Historique des commandes</h2>
          <Icon name="box" />
        </div>
        <EmptyState
          icon="box"
          title="Vos commandes auront leur place ici"
          description="Vous pourrez consulter vos achats et suivre leur statut depuis cet espace."
        >
          <p className="service-notice">
            Le service commandes n’est pas encore connecté. Aucun historique ne
            peut être affiché pour le moment.
          </p>
        </EmptyState>
      </section>
      <div className="info-strip">
        <Icon name="search" />
        <div>
          <strong>En attendant, faites de nouvelles découvertes.</strong>
          <p>
            Le catalogue vous permet de consulter les prix et les disponibilités
            des produits.
          </p>
        </div>
      </div>
    </>
  );
}
