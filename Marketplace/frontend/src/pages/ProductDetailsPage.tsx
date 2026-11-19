import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getProduct } from "../services/catalogApi";
import type { Product } from "../types/catalog";
import Icon from "../components/Icon";
import EmptyState from "../components/EmptyState";
import AddToCartButton from "../components/AddToCartButton";
import ProductImage from "../components/ProductImage";
import { formatPrice } from "../utils/format";
type Result = { id: number; product?: Product; error?: string };
export default function ProductDetailsPage() {
  const { id } = useParams();
  const productId = Number(id);
  const valid = Number.isSafeInteger(productId) && productId > 0;
  const [result, setResult] = useState<Result | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!valid) return;
    let active = true;
    getProduct(productId)
      .then((product) => {
        if (active) setResult({ id: productId, product });
      })
      .catch(() => {
        if (active)
          setResult({
            id: productId,
            error: "Produit introuvable ou service momentanément indisponible.",
          });
      });
    return () => {
      active = false;
    };
  }, [productId, valid, attempt]);
  const back = (
    <Link to="/products" className="back-link">
      ← Retour au catalogue
    </Link>
  );
  if (!valid)
    return (
      <>
        {back}
        <div className="panel">
          <EmptyState
            icon="search"
            title="Identifiant de produit invalide."
            description="Retrouvez les produits disponibles dans le catalogue."
          />
        </div>
      </>
    );
  if (!result || result.id !== productId)
    return (
      <>
        {back}
        <div className="details skeleton-details" role="status">
          <div className="skeleton-card" />
          <p>Chargement du produit…</p>
        </div>
      </>
    );
  if (result.error || !result.product)
    return (
      <>
        {back}
        <div className="error-state" role="alert">
          <h1>Ce produit n’est pas disponible</h1>
          <p>{result.error || "Produit indisponible."}</p>
          <button
            className="btn"
            onClick={() => {
              setResult(null);
              setAttempt((value) => value + 1);
            }}
          >
            Réessayer
          </button>
        </div>
      </>
    );
  const product = result.product;
  return (
    <>
      {back}
      <section className="details">
        <div className="details-visual">
          <ProductImage url={product.imageUrl} loading="eager" />
          <small>{product.category.name}</small>
        </div>
        <div className="details-body">
          <span className="category">{product.category.name}</span>
          <h1>{product.name}</h1>
          <p className="shop-name">
            <Icon name="shop" />
            Boutique : {product.shop.name}
          </p>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <span
            className={`stock-badge static-badge ${product.stock > 0 ? "in-stock" : "out-stock"}`}
          >
            {product.stock > 0
              ? `${product.stock} unité(s) disponible(s)`
              : "Rupture de stock"}
          </span>
          <div className="description">
            <h2>À propos de ce produit</h2>
            <p>
              {product.description ||
                "Aucune description disponible pour ce produit."}
            </p>
            {product.imageUrl?.startsWith("/products/commons-") && (
              <a className="text-link" href={`/products/credits.html#produit-${product.id}`}>
                Photo d’illustration et crédits
              </a>
            )}
          </div>
          <div className="detail-actions">
            <AddToCartButton key={product.id} product={product} />
            <Link to="/cart" className="text-link">
              Consulter mon panier <Icon name="cart" />
            </Link>
          </div>
        </div>
      </section>
      <div className="info-strip">
        <Icon name="shop" />
        <div>
          <strong>Continuez votre découverte</strong>
          <p>Explorez les autres produits et boutiques de la marketplace.</p>
        </div>
        <Link to="/products" className="text-link">
          Voir le catalogue <Icon name="arrow" />
        </Link>
      </div>
    </>
  );
}
