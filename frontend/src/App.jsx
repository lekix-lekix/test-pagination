import { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard/ProductCard";
import { fetchProducts } from "./api/products";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_URL = "api";

export default function App() {
  // Ces informations ne sont pas forcément nécessaires, vous pouvez les adapter à votre convenance
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [limit] = useState(15);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const page = useRef(1);
  const observerTarget = useRef(null);
  const firstRender = useRef(true);
  const categoryChanged = useRef(false);
  const categoryRef = useRef("");

  const getProducts = (cat, p, sort, order) => {
    // -> Processing fetched data, replacing already fetched data or adding to already fetched data
    fetchProducts({ cat, page: page.current, limit, sort, order })
      .then((data) => {
        if (categoryChanged.current) {
          setProducts(data);
          categoryChanged.current = false;
        } else {
          setProducts((prev) => [...prev, ...data]);
        }
      })
      .catch(() => {
        setError("Erreur de connexion serveur");
      });
  };

  useEffect(() => {
    // -> Checking if category changed to fetch new items from a new category
    if (firstRender.current) return;
    categoryRef.current = category;
    categoryChanged.current = true;
    page.current = 1;
    getProducts(category, page, limit, sort, order);
  }, [category]);

  useEffect(() => {
    // -> Checking if sorting or ordering changed
    if (firstRender.current) return;
    categoryChanged.current = true;
    getProducts(category, page, sort, order);
  }, [sort, order]);

  useEffect(() => {
    // -> Observer set after the products displayed to enable infinite scrolling
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firstRender.current) {
          page.current += 1;
          getProducts(categoryRef.current, page, sort, order);
        }
      },
      { threshold: 0.5 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [products, sort, order]);

  // -> Initial rendering, ran only once
  useEffect(() => {
    getProducts(category, page, sort, order);
    firstRender.current = false;
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h1>Catalogue produits</h1>
        <div className="filters">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Toutes categories</option>
            <option value="shoes">Chaussures</option>
            <option value="clothing">Vetements</option>
            <option value="accessories">Accessoires</option>
            <option value="bags">Sacs</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="createdAt">Date</option>
            <option value="price">Prix</option>
            <option value="name">Nom</option>
          </select>
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="asc">Croissant</option>
            <option value="desc">Decroissant</option>
          </select>
        </div>
      </div>

      {loading && <p className="loading">Chargement...</p>}
      {error && <p className="error">Erreur : {error}</p>}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <p className="empty">Aucun produit trouve.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div ref={observerTarget} /> {/* élément invisible en bas */}
        </>
      )}
    </div>
  );
}
