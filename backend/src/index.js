const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const {registerAPIRoutes} = require("./api/api")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

async function createIndexes(db) {
  const products = db.collection("products");
  await products.createIndex({
    category: 1,
    price: -1,
    name: 1,
    createdAt: -1,
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

  await createIndexes(db);
  registerAPIRoutes(app, db);

  app.listen(PORT, () =>
    console.log("Serveur demarre sur http://localhost:" + PORT),
  );
}

start().catch((err) => {
  console.error("Erreur de connexion MongoDB :", err.message);
  process.exit(1);
});
