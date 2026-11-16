
import { afterEach, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('affiche les produits du catalogue', async () => {

  const products = [
    {
      id: 1,
      name: 'PC Lenovo ThinkPad',
      description: 'Ordinateur professionnel',
      price: 7500,
      stock: 10,
      shop: {
        id: 1,
        name: 'Boutique Atlas',
      },
      category: {
        id: 1,
        name: 'Informatique',
      },
    },
  ]

  // Simuler la reponse de Catalog Service
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => products,
  })

  vi.stubGlobal('fetch', fetchMock)

  // Afficher notre composant React
  render(<App />)

  // Verifier le titre de notre marketplace
  expect(
    screen.getByText('DevOps-M Marketplace')
  ).toBeInTheDocument()

  // Verifier que le produit apparait
  expect(
    await screen.findByText('PC Lenovo ThinkPad')
  ).toBeInTheDocument()

  // Verifier que l'API est appelee
  expect(fetchMock).toHaveBeenCalledWith(
    '/api/catalog/products'
  )
})
