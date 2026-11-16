
import { useEffect, useState } from 'react'
import './App.css'

type Product = {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  shop: {
    id: number
    name: string
  }
  category: {
    id: number
    name: string
  }
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/catalog/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur HTTP ' + response.status)
        }
        return response.json()
      })
      .then((data: Product[]) => setProducts(data))
      .catch(() => setError('Impossible de charger les produits.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="marketplace">
      <header className="header">
        <h1>DevOps-M Marketplace</h1>
        <p>Marketplace Multi-Vendeurs</p>
      </header>

      <main>
        <h2>Nos produits</h2>

        {loading && <p>Chargement des produits...</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p>Aucun produit disponible.</p>
        )}

        <div className="products">
          {products.map(product => (
            <article className="product" key={product.id}>
              <h3>{product.name}</h3>

              <p>{product.description}</p>

              <p>Boutique : {product.shop.name}</p>
              <p>Catégorie : {product.category.name}</p>

              <strong>{product.price} DH</strong>

              <p>
                {product.stock > 0
                  ? `Stock : ${product.stock}`
                  : 'Rupture de stock'}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
