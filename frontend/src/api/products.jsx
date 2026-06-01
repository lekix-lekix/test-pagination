const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProducts({ cat, page, limit, sort, order }) {
  // -> Fetching products from back-end depending on pagination, limit and category
  const params = new URLSearchParams({ page, limit, sort, order });
  if (cat) params.append("cat", cat);

  const url = `${BACKEND_URL}${API_URL}/products?${params}`;
  console.log(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur serveur");
  return res.json();
}
