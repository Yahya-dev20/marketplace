import { Link } from "react-router";
import Icon from "../components/Icon";
export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="tiny-dot" /> LA DÉCOUVERTE COMMENCE ICI
          </span>
          <h1>
            Découvrez notre marketplace <em>multi-vendeurs</em>
          </h1>
          <p>
            Des boutiques à explorer. Des produits à découvrir. Retrouvez toutes
            vos envies au même endroit.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn">
              Découvrir les produits <Icon name="arrow" />
            </Link>
            <Link to="/seller" className="text-link">
              L’espace vendeur ↗
            </Link>
          </div>
          <div className="hero-note">
            <Icon name="shop" /> Plusieurs boutiques, un seul catalogue
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="art-orbit orbit-one" />
          <span className="art-orbit orbit-two" />
          <span className="art-label">LA SÉLECTION À EXPLORER</span>
          <div className="display-block block-back">
            <Icon name="leaf" />
          </div>
          <div className="display-bag">
            <span className="bag-handle" />
            <Icon name="bag" />
            <span>DevOps-M</span>
            <small>
              À CHAQUE ENVIE,
              <br />
              SA DÉCOUVERTE.
            </small>
          </div>
          <div className="display-block block-front">
            <Icon name="box" />
          </div>
          <span className="art-caption">Un monde de possibilités.</span>
        </div>
      </section>
      <section className="benefits" aria-label="Votre marketplace">
        <div>
          <Icon name="grid" />
          <span>
            <strong>Tout au même endroit</strong>
            <small>Un catalogue facile à explorer</small>
          </span>
        </div>
        <div>
          <Icon name="shop" />
          <span>
            <strong>Des boutiques à découvrir</strong>
            <small>Un univers multi-vendeurs</small>
          </span>
        </div>
        <div>
          <Icon name="box" />
          <span>
            <strong>Votre espace personnel</strong>
            <small>Panier, commandes et notifications</small>
          </span>
        </div>
      </section>
      <section className="discovery">
        <div className="section-heading">
          <div>
            <span className="eyebrow">À VOUS D’EXPLORER</span>
            <h2>Chaque envie a son chemin.</h2>
          </div>
          <Link to="/products" className="text-link">
            Voir le catalogue <Icon name="arrow" />
          </Link>
        </div>
        <div className="features">
          <Link to="/products" className="feature-card">
            <span className="feature-number">01 / DÉCOUVRIR</span>
            <Icon name="bag" />
            <h3>Votre prochaine trouvaille</h3>
            <p>
              Parcourez les produits, affinez votre recherche et découvrez les
              boutiques.
            </p>
            <span className="feature-link">
              Explorer les produits <Icon name="arrow" />
            </span>
          </Link>
          <Link to="/orders" className="feature-card">
            <span className="feature-number">02 / RETROUVER</span>
            <Icon name="box" />
            <h3>Vos achats, votre espace</h3>
            <p>Retrouvez l’espace dédié à vos commandes et à leur suivi.</p>
            <span className="feature-link">
              Mes commandes <Icon name="arrow" />
            </span>
          </Link>
          <Link to="/seller" className="feature-card">
            <span className="feature-number">03 / ENTREPRENDRE</span>
            <Icon name="shop" />
            <h3>Le côté boutique</h3>
            <p>
              Découvrez l’espace prévu pour vos boutiques, vos produits et vos
              stocks.
            </p>
            <span className="feature-link">
              Espace vendeur <Icon name="arrow" />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
