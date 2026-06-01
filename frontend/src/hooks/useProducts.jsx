import { useState, useEffect, useRef } from "react";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [category, setCategory] = useState(null);

  const page = useRef(1);
  const categoryRef = useRef(category);
  const categoryChanged = useRef(false);
  const observerTarget = useRef(null);

  const fetchProducts = (cat, p, sort, order) => {
    // -> Fetching products to back-end depending on pagination, limit and category
    const page = p.current;
    const params = new URLSearchParams({
      page,
      limit,
      sort,
      order,
      cat,
    });

    const url = `${BACKEND_URL}${API_URL}/products?${params}`;

    console.log(url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
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
    fetchProducts(category, page, sort, order);
  }, [category]);

  useEffect(() => {
    // -> Checking if sorting order or  changed
    if (firstRender.current) return;
    categoryChanged.current = true;
    fetchProducts(category, page, sort, order);
  }, [sort, order]);

  useEffect(() => {
    // -> Observer set after the products displayed to enable infinite scrolling
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firstRender.current) {
          page.current += 1;
          fetchProducts(categoryRef.current, page, sort, order);
        }
      },
      { threshold: 0.5 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [products, sort, order]);

  // -> Initial rendering
  useEffect(() => {
    fetchProducts(category, page, sort, order);
    firstRender.current = false;
  }, []);


}