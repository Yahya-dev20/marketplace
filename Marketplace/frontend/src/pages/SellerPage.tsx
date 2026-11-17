import { Link } from "react-router";
import PageHeading from "../components/PageHeading";
import Icon, { type IconName } from "../components/Icon";
const modules: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "shop",
    title: "Vos boutiques",
    description: "Un espace prévu pour retrouver et gérer vos boutiques.",
  },
  {
    icon: "bag",
    title: "Vos produits",
    description: "La gestion de vos fiches produits, réunie au même endroit.",
  },
  {
    icon: "box",
    title: "Vos stocks",
    description: "Une vue dédiée aux disponibilités de vos produits.",
  },
];
export default function SellerPage() {
  return (
    <>
      <PageHeading
        eyebrow="CÔTÉ BOUTIQUE"
        title="Espace vendeur"
        description="Un espace pour vos boutiques, vos produits et vos stocks."
      >
        <span className="status-badge">En préparation</span>
      </PageHeading>
      <section className="seller-banner">
        <div className="state-icon">
          <Icon name="shop" />
        </div>
        <div>
          <h2>Votre activité mérite son espace.</h2>
          <p>
            Le tableau de bord vendeur sera disponible prochainement. Les outils
            de gestion ne sont pas encore connectés.
          </p>
        </div>
        <Link to="/products" className="btn btn-light">
          Voir le catalogue <Icon name="arrow" />
        </Link>
      </section>
      <div className="features seller-modules">
        {modules.map((module) => (
          <section className="panel" key={module.title}>
            <Icon name={module.icon} />
            <h2>{module.title}</h2>
            <p>{module.description}</p>
            <span className="module-status">Bientôt disponible</span>
          </section>
        ))}
      </div>
      <div className="info-strip">
        <Icon name="bell" />
        <div>
          <strong>Aucune donnée vendeur n’est affichée pour le moment.</strong>
          <p>
            Les informations de votre activité apparaîtront après la connexion
            des services correspondants.
          </p>
        </div>
      </div>
    </>
  );
}
