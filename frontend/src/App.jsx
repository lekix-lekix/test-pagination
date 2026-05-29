import { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard/ProductCard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_URL = "api";

export default function App() {
  // Ces informations ne sont pas forcément nécessaires, vous pouvez les adapter à votre convenance
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
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

  const fetchProducts = (cat, p) => {
    const skip = (p.current - 1) * limit;
    const url = cat
    ? `${BACKEND_URL}${API_URL}/products?limit=${limit}&skip=${skip}&category=${cat}`
    : `${BACKEND_URL}${API_URL}/products?limit=${limit}&skip=${skip}`;
    
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        if (categoryChanged.current) {
            setProducts(data);
            categoryChanged.current = false;
        }
        else
            setProducts((prev) => [...prev, ...data]);
    });
  };

  useEffect(() => {
    categoryRef.current = category;
    categoryChanged.current = true;
    page.current = 1;
    fetchProducts(category, page);
  }, [category]);

  useEffect(() => {
    const sortedProducts = [...products].sort((a, b) => {
      let diff;
      if (sort == "createdAt") {
        diff = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sort == "price") {
        diff = parseInt(a.price) - parseInt(b.price);
      } else if (sort == "name") {
        diff = String(a.name).localeCompare(String(b.name));
      }
      return order === "asc" ? diff : -diff;
    });
    setProducts(sortedProducts);
  }, [sort, order]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
            page.current += 1;
            fetchProducts(categoryRef.current, page);
        }
      },
      { threshold: 0.5 }, // déclenche quand 50% visible
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
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
          {pagination && <div />}
          <div ref={observerTarget} /> {/* élément invisible en bas */}
        </>
      )}
    </div>
  );
}
