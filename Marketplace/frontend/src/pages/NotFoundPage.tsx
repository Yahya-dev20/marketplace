import EmptyState from "../components/EmptyState";
export default function NotFoundPage() {
  return (
    <section className="not-found">
      <span className="error-code" aria-hidden="true">
        404
      </span>
      <h1>404 — Page introuvable</h1>
      <EmptyState
        icon="search"
        title="Cette page semble avoir changé de chemin."
        description="L’adresse est peut-être incorrecte. Retrouvez la marketplace depuis la page d’accueil."
        to="/"
        action="Retour à l’accueil"
      />
    </section>
  );
}
