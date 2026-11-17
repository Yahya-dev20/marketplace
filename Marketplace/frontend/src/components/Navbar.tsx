
import { NavLink } from 'react-router'

export default function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        DevOps-M <span>Marketplace</span>
      </NavLink>

      <nav aria-label="Navigation principale">
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/products">Produits</NavLink>
        <NavLink to="/cart">Panier</NavLink>
        <NavLink to="/orders">Commandes</NavLink>
        <NavLink to="/seller">Vendeur</NavLink>
        <NavLink to="/notifications">Notifications</NavLink>
      </nav>
    </header>
  )
}
