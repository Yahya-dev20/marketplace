
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getProduct } from '../services/catalogApi'
import type { Product } from '../types/catalog'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const productId = Number(id)

    if (!Number.isSafeInteger(productId) || productId <= 0) {
      return
    }

    getProduct(productId)
      .then(setProduct)
      .catch(() => setError('Produit introuvable.'))
      .finally(() => setLoading(false))
  }, [id])

  if (!id || !Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
    return <p>Identifiant de produit invalide.</p>
  }

  if (loading) return <p>Chargement du produit...</p>
  if (error) return <p role="alert">{error}</p>
  if (!product) return <p>Produit indisponible.</p>

  return (
    <section className="details">
      <div className="details-visual" aria-hidden="true">
        📦
      </div>

      <div>
        <Link to="/products">← Retour au catalogue</Link>

        <p className="category">{product.category.name}</p>
        <h1>{product.name}</h1>
        <p>{product.description || 'Aucune description.'}</p>
        <p>Boutique : {product.shop.name}</p>

        <h2 className="product-price">
          {product.price.toLocaleString('fr-MA')} DH
        </h2>

        <p>
          {product.stock > 0
            ? `${product.stock} unité(s) disponibles`
            : 'Rupture de stock'}
        </p>

        <Link to="/cart" className="btn">
          Consulter mon panier
        </Link>
      </div>
    </section>
  )
}
