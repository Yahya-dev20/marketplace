import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const titles: Record<string, string> = {
  "/": "Accueil",
  "/products": "Catalogue",
  "/cart": "Mon panier",
  "/orders": "Mes commandes",
  "/seller": "Espace vendeur",
  "/notifications": "Mes notifications",
};
export default function MainLayout() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const previous = useRef(pathname);
  useEffect(() => {
    document.title = `${titles[pathname] || (pathname.startsWith("/products/") ? "Fiche produit" : "Page introuvable")} | DevOps-M`;
    if (previous.current !== pathname) {
      window.scrollTo?.({ top: 0, behavior: "instant" });
      main.current?.focus();
      previous.current = pathname;
    }
  }, [pathname]);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Aller au contenu
      </a>
      <Navbar />
      <main ref={main} tabIndex={-1} id="main-content" className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
