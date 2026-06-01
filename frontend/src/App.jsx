import { useState } from "react";
import { useProducts } from "./hooks/useProducts";
import ProductCard from "./ProductCard/ProductCard";

export default function App() {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const { products, loading, error, observerTarget } = useProducts({
    category,
    sort,
    order,
    limit: 15,
  });

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
          <div ref={observerTarget} />
        </>
      )}
    </div>
  );
}
