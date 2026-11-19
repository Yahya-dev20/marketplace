import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import PageHeading from "../components/PageHeading";
import OrderSummary from "../components/OrderSummary";
import {
  createProduct, createSeller, createShop, getCategories, getSeller, getSellerOrders, getSellerShops,
  getShopProducts, loginSeller, logoutSeller, updateStock, type SellerOrder, type SellerSession,
} from "../services/sellerApi";
import type { Category, Product, Shop } from "../types/catalog";
import { formatPrice } from "../utils/format";
import { formatOrderDate, orderStatusLabel } from "../utils/order";

const SESSION = "marketplace-seller-token";

function readToken(): string | null {
  try {
    return sessionStorage.getItem(SESSION);
  } catch {
    return null;
  }
}

function writeToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(SESSION, token);
    else sessionStorage.removeItem(SESSION);
  } catch {
    // Browser storage is optional for the current session.
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "L’opération a échoué.";
}

function StockRow({ product, saving, onSave }: {
  product: Product;
  saving: boolean;
  onSave: (stock: number) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("stock");
    if (value === "" || value === null) return;
    const stock = Number(value);
    if (Number.isInteger(stock) && stock >= 0 && stock <= 2147483647) onSave(stock);
  }

  return (
    <li className="seller-product">
      <div>
        <Link to={`/products/${product.id}`}>{product.name}</Link>
        <p>{formatPrice(product.price)} · {product.category.name}</p>
      </div>
      <form onSubmit={submit}>
        <label>
          Stock <input aria-label={`Stock de ${product.name}`} name="stock" type="number"
            min="0" max="2147483647" step="1" required defaultValue={product.stock} />
        </label>
        <button className="btn" disabled={saving}>Mettre à jour</button>
      </form>
    </li>
  );
}

function ShopInventory({ shop, categories, token }: { shop: Shop; categories: Category[]; token: string }) {
  const [products, setProducts] = useState<Product[]>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    getShopProducts(shop.id)
      .then((items) => { if (active) setProducts(items); })
      .catch((failure) => { if (active) setError(errorMessage(failure)); });
    return () => { active = false; };
  }, [shop.id]);

  async function save(action: () => Promise<void>, confirmation: string) {
    if (saving) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await action();
      setMessage(confirmation);
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setSaving(false);
    }
  }

  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    if (!name) {
      setError("Saisissez un nom de produit.");
      return;
    }
    const file = data.get("image");
    const image = file instanceof File && file.size > 0 ? file : undefined;
    if (image && (image.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png"].includes(image.type))) {
      setError("Sélectionnez une image JPEG ou PNG de 5 Mo maximum.");
      return;
    }
    void save(async () => {
      const product = await createProduct(token, {
        shopId: shop.id,
        name,
        description: String(data.get("description") ?? "").trim() || null,
        price: Number(data.get("price")),
        stock: Number(data.get("stock")),
        categoryId: Number(data.get("category")),
      }, image);
      setProducts((items) => [...(items ?? []), product]);
      form.reset();
    }, "Produit publié dans le catalogue.");
  }

  return (
    <section className="panel order-panel seller-inventory">
      <h2>{shop.name}</h2>
      <Link to={`/products?shop=${shop.id}`}>Voir la boutique dans le catalogue</Link>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      {!products && !error && <p role="status">Chargement du stock…</p>}
      {products && (
        <>
          <h3>Ajouter un produit</h3>
          {categories.length ? (
            <form className="seller-form" onSubmit={publish}>
              <label>Nom du produit<input name="name" required maxLength={255} /></label>
              <label>Catégorie
                <select name="category" required defaultValue="">
                  <option value="" disabled>Choisir une catégorie</option>
                  {categories.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
                </select>
              </label>
              <label>Prix (DH)<input name="price" type="number" min="0" max="9999999999.99" step="0.01" required /></label>
              <label>Stock initial<input name="stock" type="number" min="0" max="2147483647" step="1" required /></label>
              <label className="seller-form-wide">Description<textarea name="description" maxLength={2000} rows={3} /></label>
              <label className="seller-form-wide">
                Photo du produit
                <input name="image" type="file" accept="image/jpeg,image/png" />
                <small>JPEG ou PNG, 5 Mo maximum.</small>
              </label>
              <button className="btn" disabled={saving}>Publier le produit</button>
            </form>
          ) : <p>Aucune catégorie disponible.</p>}
          <h3>Gérer le stock</h3>
          {products.length === 0 && <p>Votre boutique est prête. Ajoutez votre premier produit.</p>}
          <ul className="seller-products">
            {products.map((product) => (
              <StockRow key={`${product.id}:${product.stock}`} product={product} saving={saving}
                onSave={(stock) => void save(async () => {
                  const updated = await updateStock(token, product.id, stock);
                  setProducts((items) => items?.map((item) => item.id === updated.id ? updated : item));
                }, "Stock mis à jour.")} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function SellerOrders({ token }: { token: string }) {
  const [orders, setOrders] = useState<SellerOrder[]>();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getSellerOrders(token)
      .then((result) => { if (active) setOrders(result); })
      .catch((failure) => { if (active) setError(errorMessage(failure)); });
    return () => { active = false; };
  }, [token]);

  return (
    <section className="panel order-panel seller-inventory">
      <h2>Commandes clients</h2>
      {error && <p role="alert">{error}</p>}
      {!orders && !error && <p role="status">Chargement des commandes…</p>}
      {orders?.length === 0 && <p>Aucune commande pour vos produits.</p>}
      {orders?.map((order) => (
        <article key={order.id} className="seller-order">
          <h3>Commande n° {order.id}</h3>
          <p>{orderStatusLabel[order.status]} · <time dateTime={order.createdAt}>{formatOrderDate(order.createdAt)}</time></p>
          <OrderSummary items={order.items} total={order.total} />
        </article>
      ))}
    </section>
  );
}

function SellerDashboard({ session }: { session: SellerSession }) {
  const { seller, token } = session;
  const [shops, setShops] = useState<Shop[]>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [shopId, setShopId] = useState<number>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getSellerShops(token), getCategories()])
      .then(([ownedShops, availableCategories]) => {
        if (!active) return;
        setShops(ownedShops);
        setShopId(ownedShops[0]?.id);
        setCategories(availableCategories);
      })
      .catch((failure) => { if (active) setError(errorMessage(failure)); });
    return () => { active = false; };
  }, [token]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const form = event.currentTarget;
    const name = String(new FormData(form).get("name") ?? "").trim();
    if (!name) {
      setError("Saisissez un nom de boutique.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const shop = await createShop(token, seller.id, name);
      setShops((previous) => [...(previous ?? []), shop]);
      setShopId(shop.id);
      form.reset();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setSaving(false);
    }
  }

  const shop = shops?.find(({ id }) => id === shopId);
  return (
    <>
      <section className="panel order-panel">
        <h2>{seller.name}</h2>
        {error && <p role="alert">{error}</p>}
        {!shops && !error && <p role="status">Chargement de vos boutiques…</p>}
        {shops && (
          <>
            {shops.length > 0 && (
              <label className="seller-shop-picker">Boutique active
                <select value={shopId} onChange={(event) => setShopId(Number(event.target.value))}>
                  {shops.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
                </select>
              </label>
            )}
            <form className="seller-form" onSubmit={submit}>
              <label>Nom de la nouvelle boutique<input name="name" required maxLength={255} /></label>
              <button className="btn" disabled={saving}>Créer la boutique</button>
            </form>
          </>
        )}
      </section>
      {shop && <ShopInventory key={shop.id} shop={shop} categories={categories} token={token} />}
    </>
  );
}

export default function SellerPage() {
  const [initialToken] = useState(readToken);
  const [restoring, setRestoring] = useState(Boolean(initialToken));
  const [session, setSession] = useState<SellerSession>();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [section, setSection] = useState<"stock" | "orders">("stock");

  useEffect(() => {
    if (!initialToken) return;
    let active = true;
    getSeller(initialToken)
      .then((seller) => { if (active) setSession({ seller, token: initialToken }); })
      .catch((failure) => {
        if (active) {
          writeToken(null);
          setError(errorMessage(failure));
        }
      })
      .finally(() => { if (active) setRestoring(false); });
    return () => { active = false; };
  }, [initialToken]);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const password = String(data.get("password") ?? "");
    if ((registering && !name) || !email) {
      setError("Renseignez votre nom et votre adresse e-mail.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = registering ? await createSeller(name, email, password) : await loginSeller(email, password);
      writeToken(result.token);
      setSection("stock");
      setSession(result);
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    if (!session || saving) return;
    setSaving(true);
    setError("");
    try {
      await logoutSeller(session.token);
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      writeToken(null);
      setSession(undefined);
      setRegistering(false);
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeading eyebrow="CÔTÉ BOUTIQUE" title="Espace vendeur"
        description="Gérez vos boutiques, vos stocks et vos commandes clients.">
        {session && <button type="button" className="btn" disabled={saving} onClick={logout}>Se déconnecter</button>}
      </PageHeading>
      {restoring && <p role="status">Vérification de la session…</p>}
      {session && (
        <>
          <nav className="seller-navigation" aria-label="Espace vendeur">
            <button type="button" className="btn" aria-pressed={section === "stock"} onClick={() => setSection("stock")}>
              Boutiques et stock
            </button>
            <button type="button" className="btn" aria-pressed={section === "orders"} onClick={() => setSection("orders")}>
              Commandes clients
            </button>
          </nav>
          {section === "stock" ? <SellerDashboard session={session} /> : <SellerOrders token={session.token} />}
        </>
      )}
      {!session && !restoring && (
        <section className="panel order-panel">
          <h2>{registering ? "Créer un compte vendeur" : "Connexion vendeur"}</h2>
          {error && <p role="alert">{error}</p>}
          <form className="seller-form" onSubmit={authenticate} key={Number(registering)}>
            {registering && <label>Nom du vendeur<input name="name" required maxLength={255} autoComplete="name" /></label>}
            <label>Adresse e-mail<input name="email" type="email" required maxLength={255} autoComplete="username" /></label>
            <label>Mot de passe
              <input name="password" type="password" minLength={12} maxLength={128} required
                autoComplete={registering ? "new-password" : "current-password"} />
              {registering && <small>12 caractères minimum.</small>}
            </label>
            <button className="btn" disabled={saving}>{registering ? "Créer le compte" : "Se connecter"}</button>
          </form>
          <button type="button" className="text-button" disabled={saving}
            onClick={() => { setRegistering(!registering); setError(""); }}>
            {registering ? "J’ai déjà un compte vendeur" : "Créer un compte vendeur"}
          </button>
        </section>
      )}
    </>
  );
}
