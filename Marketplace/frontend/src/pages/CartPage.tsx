import PageHeading from "../components/PageHeading";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
export default function CartPage() {
  return (
    <>
      <PageHeading
        eyebrow="VOTRE ESPACE ACHATS"
        title="Mon panier"
        description="Vos découvertes se retrouvent ici."
      />
      <div className="workspace-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Votre sélection</h2>
            <Icon name="cart" />
          </div>
          <EmptyState
            icon="cart"
            title="Votre panier vous attend"
            description="Explorez les boutiques et découvrez les produits qui vous ressemblent."
          >
            <p className="service-notice">
              Le service panier n’est pas encore connecté. Son contenu sera
              disponible une fois le service activé.
            </p>
          </EmptyState>
        </section>
        <aside className="panel side-panel">
          <span className="eyebrow">LE PARCOURS D’ACHAT</span>
          <h2>De l’envie à la découverte</h2>
          <ol className="steps">
            <li>
              <strong>Explorez le catalogue</strong>
              <span>Recherchez un produit ou une catégorie.</span>
            </li>
            <li>
              <strong>Consultez les détails</strong>
              <span>Prix, boutique et disponibilité.</span>
            </li>
            <li>
              <strong>Retrouvez votre panier</strong>
              <span>Disponible dès la connexion du service.</span>
            </li>
          </ol>
        </aside>
      </div>
    </>
  );
}
