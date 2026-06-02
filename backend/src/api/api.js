function parseQueryString(query) {
  // -> Parsing and validating data from the url query string
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);
  const page = Math.max(parseInt(query.page) || 1, 1);
  const skip = (page - 1) * limit;

  const ALLOWED_CAT = [
    "shoes",
    "clothing",
    "categories",
    "accessories",
    "bags",
  ];

  const ALLOWED_SORT = ["createdAt", "price", "name"];
  const ALLOWED_ORDER = ["asc", "desc"];

  const filter = { limit, page, skip };

  if (query.cat && ALLOWED_CAT.includes(query.cat)) {
    filter.cat = query.cat.trim();
  }

  if (query.sort && ALLOWED_SORT.includes(query.sort)) {
    filter.sort = query.sort.trim();
  }

  if (query.order && ALLOWED_ORDER.includes(query.order)) {
    query.order == "asc" ? (filter.order = 1) : (filter.order = -1);
  }

  return filter;
}

/**
 * Registers all API routes for the application.
 *
 * @param {import('express').Application} app - Express application instance
 * @param {import('mongodb').Db} db - MongoDB database instance
 *
 * @route GET /api/products
 * @param {number} [req.query.limit=10] - Number of products to return (default: 10)
 * @param {number} [req.query.skip=0] - Number of products to skip (default: 0)
 * @param {string} [req.query.category] - Filter by category (e.g. "clothing")
 *
 * @returns {Array<{
 *   _id: string,
 *   name: string,
 *   description: string,
 *   price: number,
 *   stock: number,
 *   category: string,
 *   createdAt: string
 * }>} Liste de produits
 *
 * @example
 * // GET /api/products?limit=15&skip=0&category=clothing
 * // → [{ _id: "...", name: "...", price: 26.99, ... }]
 */

export async function registerAPIRoutes(app, db) {
  // -> Main get request that returns and sort products depending query parameters
  app.get("/api/products", async (req, res) => {
    try {
      const { limit, skip, sort, order, cat } = parseQueryString(req.query);

      const filter = {};
      if (cat) filter.category = cat;

      const products = await db
        .collection("products")
        .find(filter)
        .sort({ [sort]: order, _id: 1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // -> Get infos from MongoDB on a particular request
  app.get("/api/products/explain", async (req, res) => {
    try {
      const { limit, skip, sort, order, cat } = parseQueryString(req.query);
      console.log(req.query);
      const filter = {};
      if (cat) filter.category = cat;

      const explanation = await db
        .collection("products")
        .find(filter)
        .sort({ [sort]: order, _id: 1 })
        .skip(skip)
        .limit(limit)
        .explain("executionStats");

      res.json(explanation);
    } catch (err) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });
}
