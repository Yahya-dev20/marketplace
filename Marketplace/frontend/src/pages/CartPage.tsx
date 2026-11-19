import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'

import type { Cart } from '../types/cart'

import {
  DEMO_USER_ID,
  getCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
} from '../services/cartApi'

import { formatPrice } from '../utils/format'
import './CartPage.css'

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const loadCart = useCallback(async () => {
    const result = await getCart(DEMO_USER_ID)
    setCart(result)
  }, [])

  useEffect(() => {
    let active = true

    getCart(DEMO_USER_ID)
      .then(result => {
        if (active) setCart(result)
      })
      .catch(() => {
        if (active) {
          setError('Impossible de charger le panier.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function changeQuantity(
    productId: number,
    quantity: number
  ) {
    if (quantity < 1 || busy) return

    setBusy(true)
    setError('')

    try {
      const updated = await updateCartQuantity(
        DEMO_USER_ID,
        productId,
        quantity
      )

      setCart(updated)
    } catch {
      setError('Impossible de modifier la quantité.')
    } finally {
      setBusy(false)
    }
  }

  async function removeProduct(productId: number) {
    if (busy) return

    setBusy(true)
    setError('')

    try {
      await removeCartItem(DEMO_USER_ID, productId)
      await loadCart()
    } catch {
      setError('Impossible de supprimer ce produit.')
    } finally {
      setBusy(false)
    }
  }

  async function emptyCart() {
    if (busy) return

    if (!window.confirm('Voulez-vous vider le panier ?')) {
      return
    }

    setBusy(true)
    setError('')

    try {
      await clearCart(DEMO_USER_ID)
      await loadCart()
    } catch {
      setError('Impossible de vider le panier.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="cart-page">

      <div className="cart-heading">
        <div>
          <h1>Mon panier</h1>
          <p>Gérez vos articles avant de commander.</p>
        </div>

        <Link to="/products" className="cart-back">
          Continuer mes achats
        </Link>
      </div>

      {error && (
        <p className="cart-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p role="status">Chargement du panier...</p>
      ) : !cart ? (
        <div className="cart-empty">
          <h2>Panier indisponible</h2>
          <p>Vérifiez la connexion avec Cart Service.</p>
          <button type="button"
            onClick={() => {
              setLoading(true)
              setError('')
              loadCart()
                .catch(() => {
                  setError('Connexion impossible.')
                })
                .finally(() => setLoading(false))
            }}
          >
            Réessayer
          </button>
        </div>
      ) : cart.items.length === 0 ? (
        <div className="cart-empty">
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos produits et ajoutez votre premier article.</p>
          <Link to="/products" className="btn">
            Voir les produits
          </Link>
        </div>
      ) : (
        <div className="cart-layout">

          <div className="cart-list">
            <div className="cart-list-header">
              <h2>
                Mes articles ({cart.items.length})
              </h2>

              <button type="button"
                className="cart-clear"
                onClick={emptyCart}
                disabled={busy}
              >
                Vider le panier
              </button>
            </div>

            {cart.items.map(item => (
              <article
                className="cart-item"
                key={item.productId}
              >
                <div className="cart-item-image" aria-hidden="true">
                  📦
                </div>

                <div className="cart-item-details">
                  <h3>{item.productName}</h3>

                  <p>
                    {formatPrice(item.unitPrice)} / unité
                  </p>

                  <div className="cart-quantity">
                    <button type="button"
                      aria-label={`Diminuer ${item.productName}`}
                      disabled={busy || item.quantity <= 1}
                      onClick={() =>
                        changeQuantity(
                          item.productId,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button type="button"
                      aria-label={`Augmenter ${item.productName}`}
                      disabled={busy}
                      onClick={() =>
                        changeQuantity(
                          item.productId,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <strong>
                    {formatPrice(item.subtotal)}
                  </strong>

                  <button type="button"
                    className="cart-remove"
                    disabled={busy}
                    onClick={() =>
                      removeProduct(item.productId)
                    }
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Résumé de commande</h2>

            <div className="summary-line">
              <span>Articles</span>
              <span>
                {cart.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )}
              </span>
            </div>

            <div className="summary-line">
              <span>Sous-total</span>
              <span>{formatPrice(cart.total)}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPrice(cart.total)}</strong>
            </div>

            <p className="cart-note">
              Le paiement sera simulé lors de la commande.
            </p>

            <Link to="/checkout" className="btn cart-checkout">
              Passer à la commande
            </Link>

          </aside>

        </div>
      )}
    </section>
  )
}
