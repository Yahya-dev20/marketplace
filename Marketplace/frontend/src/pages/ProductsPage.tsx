
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/catalogApi'
import type { Product } from '../types/catalog'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Toutes')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('Impossible de charger le catalogue.'))
      .finally(() => setLoading(false))
  }, [])

  const categories = [
    'Toutes',
    ...new Set(products.map(p => p.category.name)),
  ]

  const filtered = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === 'Toutes' ||
      product.category.name === category

    return matchesSearch && matchesCategory
  })

  return (
    <section>
      <div className="page-heading">
        <h1>Notre catalogue</h1>
        <p>Découvrez les produits de nos vendeurs.</p>
      </div>

      <div className="filters">
        <input
          aria-label="Rechercher un produit"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          aria-label="Filtrer par catégorie"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Chargement des produits...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <p className="muted">
            {filtered.length} produit(s) trouvé(s)
          </p>

          <div className="product-grid">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p>Aucun produit ne correspond à votre recherche.</p>
          )}
        </>
      )}
    </section>
  )
}
