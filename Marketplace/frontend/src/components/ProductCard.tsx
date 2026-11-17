
import { Link } from 'react-router'
import type { Product } from '../types/catalog'

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <article className="product-card">
      <div className="product-visual">
        <span>📦</span>
      </div>

      <div className="product-body">
        <span className="category">
          {product.category.name}
        </span>

        <h3>{product.name}</h3>

        <p className="muted">{product.shop.name}</p>

        <p className="product-price">
          {product.price.toLocaleString('fr-MA')} DH
        </p>

        <p className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
          {product.stock > 0
            ? `En stock : ${product.stock}`
            : 'Rupture de stock'}
        </p>

        <Link to={`/products/${product.id}`} className="btn">
          Voir le produit
        </Link>
      </div>
    </article>
  )
}
