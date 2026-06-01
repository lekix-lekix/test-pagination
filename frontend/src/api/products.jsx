// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// const API_URL = "api";
const LIMIT = 15;

// export async function fetchProducts(cat, p, sort, order) {
//   // -> Fetching products to back-end depending on pagination, limit and category
//   const page = p.current;
//   const params = new URLSearchParams({
//     page,
//     LIMIT,
//     sort,
//     order,
//     cat,
//   });

//   const url = `${BACKEND_URL}${API_URL}/products?${params}`;

//   console.log(url);

//   fetch(url)
//     .then((res) => {
//       if (!res.ok) throw new Error("Erreur serveur");
//       return res.json();
//     })
//     .then((data) => {
//       if (categoryChanged.current) {
//         setProducts(data);
//         categoryChanged.current = false;
//       } else {
//         setProducts((prev) => [...prev, ...data]);
//       }
//     })
//     .catch(() => {
//       setError("Erreur de connexion serveur");
//     });
// };

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProducts({ cat, page, limit, sort, order }) {
  const params = new URLSearchParams({ page, limit, sort, order });
  if (cat) params.append("category", cat);

  const res = await fetch(`${BACKEND_URL}${API_URL}/products?${params}`);
  if (!res.ok) throw new Error("Erreur serveur");
  return res.json();
}