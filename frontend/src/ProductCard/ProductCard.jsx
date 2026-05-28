import './ProductCard.css'

export default function ProductCard({ product }) {
  const { name, description, price, stock, category } = product;

  return (
    <div className="product-card">
      <div className="product-image">
        <span>🖼️</span>
      </div>
      <div className="product-body">
        <span className="product-category">{category}</span>
        <h2>{name}</h2>
        <p>{description}</p>
        <div className="product-footer">
          <span className="product-price">{price.toFixed(2)} €</span>
          <span className="product-stock">Stock : {stock}</span>
        </div>
        <button className="align-bottom">Ajouter au panier</button>
      </div>
    </div>
  );
}