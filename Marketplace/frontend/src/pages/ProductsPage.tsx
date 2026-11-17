import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import ProductCard from "../components/ProductCard";
import PageHeading from "../components/PageHeading";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import { getProducts } from "../services/catalogApi";
import type { Product } from "../types/catalog";
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .trim();
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [params, setParams] = useSearchParams();
  const search = params.get("q") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "default";
  const available = params.get("available") === "true";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch(() => {
        if (active)
          setError(
            "Impossible de charger le catalogue. Vérifiez votre connexion et réessayez.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  function update(key: string, value: string) {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  }
  function retry() {
    setLoading(true);
    setError("");
    setAttempt((value) => value + 1);
  }
  const categories = [
    ...new Set(products.map((product) => product.category.name)),
  ].sort((a, b) => a.localeCompare(b, "fr"));
  const filtered = products.filter(
    (product) =>
      normalize(product.name).includes(normalize(search)) &&
      (!category || product.category.name === category) &&
      (!available || product.stock > 0),
  );
  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "name")
    filtered.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  const hasFilters = Boolean(
    search || category || available || sort !== "default",
  );
  return (
    <>
      <PageHeading
        eyebrow="LES BOUTIQUES, À PORTÉE DE MAIN"
        title="Notre catalogue"
        description="Explorez les produits et trouvez votre prochaine découverte."
      />
      <div className="catalog-layout">
        <aside className="panel catalog-sidebar">
          <div className="panel-heading">
            <h2>Affiner la sélection</h2>
            <Icon name="grid" />
          </div>
          <div className="filter-fields">
            <label htmlFor="category">Catégorie</label>
            <select
              id="category"
              value={category}
              onChange={(event) => update("category", event.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {category && !categories.includes(category) && (
                <option value={category}>{category}</option>
              )}
              {categories.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={available}
                onChange={(event) =>
                  update("available", event.target.checked ? "true" : "")
                }
              />
              En stock uniquement
            </label>
            {hasFilters && (
              <button className="text-button" onClick={() => setParams({})}>
                Réinitialiser les filtres
              </button>
            )}
          </div>
          <div className="sidebar-note">
            <Icon name="shop" />
            <p>
              Des produits de différentes boutiques, réunis dans un seul
              catalogue.
            </p>
          </div>
        </aside>
        <section
          className="catalog-results"
          aria-label="Résultats du catalogue"
          aria-busy={loading}
        >
          <div className="catalog-toolbar">
            <label className="search-field">
              <Icon name="search" />
              <input
                type="search"
                aria-label="Rechercher un produit"
                placeholder="Rechercher un produit…"
                value={search}
                onChange={(event) => update("q", event.target.value)}
              />
            </label>
            <label className="sort-field">
              <span>Trier par</span>
              <select
                aria-label="Trier les produits"
                value={sort}
                onChange={(event) => update("sort", event.target.value)}
              >
                <option value="default">Ordre du catalogue</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom : A à Z</option>
              </select>
            </label>
          </div>
          {loading && (
            <>
              <p role="status" className="muted">
                Chargement des produits…
              </p>
              <div className="product-grid" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="skeleton-card">
                    <div />
                    <span />
                    <span />
                  </div>
                ))}
              </div>
            </>
          )}
          {error && (
            <div className="error-state" role="alert">
              <Icon name="box" />
              <h2>Le catalogue est momentanément indisponible</h2>
              <p>{error}</p>
              <button className="btn" onClick={retry}>
                Réessayer <Icon name="arrow" />
              </button>
            </div>
          )}
          {!loading && !error && (
            <>
              <p className="results-count" role="status">
                <strong>{filtered.length}</strong> produit
                {filtered.length > 1 ? "s" : ""} trouvé
                {filtered.length > 1 ? "s" : ""}
                <span>Le choix commence ici.</span>
              </p>
              <div className="product-grid">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="panel">
                  <EmptyState
                    icon="search"
                    title={
                      products.length
                        ? "Aucun produit ne correspond"
                        : "Le catalogue attend ses premiers produits"
                    }
                    description={
                      products.length
                        ? "Essayez un autre mot-clé ou ajustez les filtres de votre recherche."
                        : "Les produits des boutiques apparaîtront ici dès leur disponibilité."
                    }
                  />
                  {hasFilters && (
                    <button
                      className="text-button reset-empty"
                      onClick={() => setParams({})}
                    >
                      Effacer la recherche et les filtres
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
