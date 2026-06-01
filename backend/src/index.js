const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

function parseQueryString(query) {
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
    if (query.order == "asc") filter.order = 1;
    else filter.order = -1;
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

async function registerRoutes(app, db) {
  app.get("/api/products", async (req, res) => {
    try {
      const { limit, skip, sort, order, cat } = parseQueryString(
        req.query,
      );

      const filter = {};
      if (cat) filter.category = cat;

      console.log(limit, skip, sort, order, cat);
      const products = await db
        .collection("products")
        .find(filter)
        .sort({ [sort]: order, _id: 1 })
        .skip(skip)
        .limit(limit)
        .toArray();

    //   console.log(products);
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });
}

async function createIndexes(db) {
  const products = db.collection("products");
  await products.createIndex({
    category: 1,
    price: -1,
    name: 1,
    createdAt: -1,
  });
  console.log("Index OK");
}

async function start() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log("Connecté à MongoDB");

  const db = client.db("shop");

  app.locals.db = db;

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
    }),
  );
  app.use(express.json());

  await createIndexes(db);
  registerRoutes(app, db);

  app.listen(PORT, () =>
    console.log("Serveur demarre sur http://localhost:" + PORT),
  );
}

start().catch((err) => {
  console.error("Erreur de connexion MongoDB :", err.message);
  process.exit(1);
});
