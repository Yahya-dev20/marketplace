import { useState } from "react";
import { NavLink } from "react-router";
import Icon from "./Icon";
const links = [
  ["/", "Accueil"],
  ["/products", "Produits"],
  ["/orders", "Commandes"],
  ["/seller", "Espace vendeur"],
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="announcement">
        Des boutiques différentes. Une seule destination.
      </div>
      <header className="navbar">
        <div className="nav-inner">
          <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-icon">
              <Icon name="bag" />
            </span>
            <span>
              DevOps-M<small>MARKETPLACE</small>
            </span>
          </NavLink>
          <nav className="desktop-nav" aria-label="Navigation principale">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <NavLink
              to="/notifications"
              className="icon-button"
              aria-label="Notifications"
              onClick={() => setOpen(false)}
            >
              <Icon name="bell" />
            </NavLink>
            <NavLink
              to="/cart"
              className="cart-link"
              onClick={() => setOpen(false)}
            >
              <Icon name="cart" />
              <span>Panier</span>
            </NavLink>
            <button
              type="button"
              className="icon-button menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen(!open)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Navigation mobile"
          hidden={!open}
        >
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
    </>
  );
}
