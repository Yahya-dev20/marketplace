import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section className="page-heading">
      <h1>404 — Page introuvable</h1>
      <p>Cette page n'existe pas.</p>
      <Link to="/" className="btn">
        Retour à l'accueil
      </Link>
    </section>
  )
}