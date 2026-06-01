import { useState, useEffect, useRef } from "react";
import { fetchProducts } from "../api/products";

export function useProducts({ category, sort, order, limit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const page = useRef(1);
  const observerTarget = useRef(null);
  const firstRender = useRef(true);
  const categoryChanged = useRef(false);
  const categoryRef = useRef("");

  const getProducts = (cat, p, sort, order) => {
    // -> Fetch and process data, replacing data in [products] or appending to it
    fetchProducts({ cat, page: page.current, limit, sort, order })
      .then((data) => {
        if (categoryChanged.current) {
          setProducts(data);
          categoryChanged.current = false;
        } else {
          setProducts((prev) => [...prev, ...data]);
        }
      })
      .catch(() => setError("Erreur de connexion serveur"));
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

  useEffect(() => {
    // -> Initial rendering
    getProducts(category, page, sort, order);
    firstRender.current = false;
  }, []);

  return { products, loading, error, observerTarget };
}
