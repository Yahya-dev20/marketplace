import { useState } from "react";
import { addToCart, DEMO_USER_ID } from "../services/cartApi";
import type { Product } from "../types/catalog";

export default function AddToCartButton({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  async function add() {
    setAdding(true);
    setMessage("");
    try {
      await addToCart(DEMO_USER_ID, product.id, 1);
      setMessage("Produit ajouté au panier.");
    } catch {
      setMessage("Impossible d’ajouter ce produit. Vérifiez le stock et votre panier.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <>
      <button type="button" className="btn" disabled={adding || product.stock <= 0} onClick={add}>
        {adding ? "Ajout en cours…" : "Ajouter au panier"}
      </button>
      {message && <p role="status">{message}</p>}
    </>
  );
}
