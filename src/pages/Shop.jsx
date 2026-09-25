
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Shop({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
fetch(`${import.meta.env.VITE_API_URL}/products`)      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) =>
        console.error("Error loading products:", error)
      );
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts =
    category === "All"
      ? products
      : products.filter(
          (product) => product.category === category
        );

  return (
    <main className="page">
      <div className="page-heading">
        <p className="section-small">AKHUND WEARS</p>
        <h1>Shop Collection</h1>
        <p>
          Explore our collection of traditional Pakistani products.
        </p>
      </div>

      <div className="category-filter">
        {categories.map((item) => (
          <button
            key={item}
            className={
              category === item ? "active-filter" : ""
            }
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={{
              ...product,
              id: product._id,
              price: `Rs. ${product.price.toLocaleString()}`,
            }}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </main>
  );
}

export default Shop;
