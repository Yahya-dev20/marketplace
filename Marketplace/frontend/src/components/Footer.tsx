import { Link } from "react-router";
import Icon from "./Icon";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Link to="/" className="brand">
            <span className="brand-icon">
              <Icon name="bag" />
            </span>
            <span>
              DevOps-M<small>MARKETPLACE</small>
            </span>
          </Link>
          <p>Vos envies, de nouvelles découvertes.</p>
        </div>
        <nav aria-label="Navigation de pied de page">
          <Link to="/products">Le catalogue</Link>
          <Link to="/orders">Mes commandes</Link>
          <Link to="/seller">Espace vendeur</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} DevOps-M Marketplace</span>
        <span>Projet Microservices · CI/CD · Kubernetes</span>
      </div>
    </footer>
  );
}
