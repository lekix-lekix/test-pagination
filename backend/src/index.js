const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

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
    const limit = parseInt(req.query.limit) || 15;
    const skip = parseInt(req.query.skip) || 0;
    const category = req.query.category;

    const filter = {};

    if (req.query.category && req.query.category.trim() !== "") {
      filter.category = req.query.category;
    }

    const products = await db
      .collection("products")
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json(products);
  });
}

async function start() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log("Connecté à MongoDB");

  const db = client.db("shop");
  app.locals.db = db;

  app.use(cors());
  app.use(express.json());

  registerRoutes(app, db);

  app.listen(PORT, () =>
    console.log("Serveur demarre sur http://localhost:" + PORT),
  );
}

start().catch((err) => {
  console.error("Erreur de connexion MongoDB :", err.message);
  process.exit(1);
});
