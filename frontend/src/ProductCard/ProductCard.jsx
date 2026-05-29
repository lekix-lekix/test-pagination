import "./ProductCard.css";
import {
  IconShoe,
  IconHanger,
  IconSunglasses,
  IconBackpack,
  IconQuestionMark,
} from "@tabler/icons-react";

export default function ProductCard({ product }) {
  const { name, description, price, stock, category, createdAt } = product;
  const date = new Date(createdAt).toLocaleDateString("fr-FR");

  const categoryColors = {
    shoes: { bg: "#EAF3DE", icon: "#3B6D11" },
    clothing: { bg: "#EEEDFE", icon: "#3C3489" },
    accessories: { bg: "#FAEEDA", icon: "#633806" },
    bags: { bg: "#FBEAF0", icon: "#72243E" },
  };

  const categoryIcons = {
    shoes: <IconShoe size={130} />,
    clothing: <IconHanger size={130} />,
    accessories: <IconSunglasses size={130} />,
    bags: <IconBackpack size={130} />,
  };

  const colors = categoryColors[category] || { bg: "#F1EFE8", icon: "#5F5E5A" };
  const icon = categoryIcons[category] || <IconQuestionMark size={130} />;

  return (
    <div className="product-card shadow-md border-2 border-black hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-350">
      <div
        className="product-image rounded-md border border-gray-300"
        style={{ background: colors.bg, color: colors.icon }}
      >
        {icon}
      </div>
      <div className="product-body h-2/3 flex flex-col justify-between">
        <span className="product-category shadow-md ">{category}</span>
        <h2 className="h-15">{name}</h2>
        <p className="h-20">{description}</p>
        <div className="product-footer">
          <div className="flex items-center h-20 w-full justify-evenly border border-gray-300 rounded-md shadow-md">
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
