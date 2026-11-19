export type CartItem = {
  productId: number
  productName: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export type Cart = {
  userId: number
  items: CartItem[]
  total: number
}
