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
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const skip = (page - 1) * limit;
      const filter = {};

      if (
        req.query.category &&
        /^[a-zA-Z0-9-]+$/.test(req.query.category.trim())
      ) {
        filter.category = req.query.category.trim();
      }

      const products = await db
        .collection("products")
        .find(filter)
        .skip(skip)
        .limit(limit)
        .toArray();

      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });
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

  registerRoutes(app, db);

  app.listen(PORT, () =>
    console.log("Serveur demarre sur http://localhost:" + PORT),
  );
}

start().catch((err) => {
  console.error("Erreur de connexion MongoDB :", err.message);
  process.exit(1);
});
