# API Documentation

## GET /api/products

Retourne une liste paginée de produits.

### Paramètres

| Paramètre  | Type   | Défaut | Description                        |
|------------|--------|--------|------------------------------------|
| `limit`    | number | 10     | Nombre de produits à retourner     |
| `skip`     | number | 0      | Nombre de produits à sauter        |
| `category` | string | -      | Filtre par catégorie ex: "clothing"|

### Exemple
GET /api/products?limit=15&skip=0&category=clothing

### Réponse

```json
[
  {
    "_id": "6a182a2d9194efeeeb9df8a3",
    "name": "Urban Drift — Essential Henley",
    "description": "Un(e) essential henley...",
    "price": 26.99,
    "stock": 7,
    "category": "clothing",
    "createdAt": "2026-05-27T11:42:37.622Z"
  }
]
```