import { Link } from "react-router";
import type { Product } from "../types/catalog";
import Icon from "./Icon";
import { formatPrice } from "../utils/format";
export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-visual"
        aria-label={`Voir ${product.name}`}
      >
        <Icon name="box" />
        <span>Visuel non disponible</span>
        <span
          className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-stock"}`}
        >
          {product.stock > 0 ? "En stock" : "Indisponible"}
        </span>
      </Link>
      <div className="product-body">
        <span className="category">{product.category.name}</span>
        <h3>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="shop-name">
          <Icon name="shop" />
          {product.shop.name}
        </p>
        <div className="card-bottom">
          <strong className="product-price">
            {formatPrice(product.price)}
          </strong>
          <Link
            to={`/products/${product.id}`}
            className="product-link"
            aria-label={`Voir le produit ${product.name}`}
          >
            <Icon name="arrow" />
          </Link>
        </div>
        <p className="stock-count">
          {product.stock > 0
            ? `${product.stock} unité(s) disponible(s)`
            : "Rupture de stock"}
        </p>
      </div>
    </article>
  );
}
