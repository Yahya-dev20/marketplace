
import { Link } from 'react-router'

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">Bienvenue sur DevOps-M</span>

          <h1>Découvrez notre marketplace multi-vendeurs</h1>

          <p>
            Explorez les produits de différentes boutiques
            depuis une seule plateforme.
          </p>

          <Link to="/products" className="btn btn-light">
            Découvrir les produits
          </Link>
        </div>

        <div className="hero-symbol" aria-hidden="true">
          🛍️
        </div>
      </section>

      <section className="features">
        <article>
          <h3>🛒 Shopping simple</h3>
          <p>Explorez les produits et préparez votre panier.</p>
        </article>

        <article>
          <h3>🏪 Multi-vendeurs</h3>
          <p>Découvrez les boutiques de notre marketplace.</p>
        </article>

        <article>
          <h3>📦 Suivi des commandes</h3>
          <p>Consultez les états de vos commandes.</p>
        </article>
      </section>
    </>
  )
}
