import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

function Home({ onAddToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
fetch(`${import.meta.env.VITE_API_URL}/products`)      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) =>
        console.error("Error loading products:", error)
      );
  }, []);

  return (
    <>
      <Hero />

      <section className="culture-banner">
        <div className="culture-image">
          <img
            src="/images/culture-banner.png"
            alt="Pakistani cultural heritage"
          />
        </div>

        <div className="culture-content">
          <p>OUR CULTURE</p>

          <h2>Tradition in Every Detail</h2>

          <p>
            From the mountains of the north to the historic streets of
            Peshawar, Pakistani culture carries stories worth wearing.
          </p>

          <Link to="/shop" className="secondary-btn">
            Discover More
          </Link>
        </div>
      </section>

      <section className="products-section">
        <div className="section-heading">
          <div>
            <p className="section-small">AKHUND WEARS</p>
            <h2>Our Collection</h2>
          </div>

          <Link to="/shop" className="view-all">
            View All →
          </Link>
        </div>

        <div className="products-grid">
          {products.map((product) => (
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
      </section>

      <section className="story-section">
        <p className="section-small">WHY AKHUND WEARS?</p>

        <h2>Culture Should Be Worn, Not Forgotten.</h2>

        <p>
          We bring traditional Pakistani products together in one place,
          celebrating the people, craftsmanship, and cultures behind them.
        </p>
      </section>
    </>
  );
}

export default Home;