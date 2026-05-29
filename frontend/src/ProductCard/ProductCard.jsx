import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { name, description, price, stock, category, createdAt } = product;
  const date = new Date(createdAt).toLocaleDateString("fr-FR");

  return (
    <div className="product-card shadow-md border border-black hover:shadow-2xl transition-shadow duration-350">
      <div className="product-image">
        <span>🖼️</span>
      </div>
      <div className="product-body h-2/3 flex flex-col justify-between">
        <span className="product-category shadow-md ">{category}</span>
        <h2 className="h-15">{name}</h2>
        <p className="h-20">{description}</p>
        <div className="product-footer">
          <div  className="flex items-center h-20 w-full justify-evenly border  rounded-md shadow-md">
            <span className="product-price">{price.toFixed(2)} €</span>
            <span className="product-stock text-center">Stock : {stock}</span>
          </div>
        </div>
        <button className="mt-auto w-full">Ajouter au panier</button>{" "}
      </div>
      <p className="text-right">{date}</p>
    </div>
  );
}
