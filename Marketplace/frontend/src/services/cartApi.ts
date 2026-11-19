import type { Cart } from '../types/cart'

const API = '/api/carts'

export const DEMO_USER_ID = 1

async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`)
  }
}

// Consulter le panier
export async function getCart(userId: number): Promise<Cart> {
  const response = await fetch(`${API}/${userId}`)
  await checkResponse(response)
  return response.json()
}

// Ajouter un produit
export async function addToCart(
  userId: number,
  productId: number,
  quantity: number
): Promise<Cart> {
  const response = await fetch(`${API}/${userId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  })

  await checkResponse(response)
  return response.json()
}

// Modifier la quantite
export async function updateCartQuantity(
  userId: number,
  productId: number,
  quantity: number
): Promise<Cart> {
  const response = await fetch(
    `${API}/${userId}/items/${productId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    }
  )

  await checkResponse(response)
  return response.json()
}

// Supprimer un produit
export async function removeCartItem(
  userId: number,
  productId: number
): Promise<void> {
  const response = await fetch(
    `${API}/${userId}/items/${productId}`,
    { method: 'DELETE' }
  )

  await checkResponse(response)
}

// Vider tout le panier
export async function clearCart(
  userId: number
): Promise<void> {
  const response = await fetch(`${API}/${userId}`, {
    method: 'DELETE',
  })

  await checkResponse(response)
}
