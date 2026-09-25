
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductDetails({ onAddToCart }) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)      .then((res) => {
        if (!res.ok) {
          throw new Error("Product not found");
        }

        return res.json();
      })
      .then((data) => {
        setProduct({
          ...data,
          id: data._id,
          price: `Rs. ${data.price.toLocaleString()}`,
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="page simple-page">
        <h1>Loading...</h1>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page simple-page">
        <h1>Product Not Found</h1>

        <Link to="/shop" className="primary-btn">
          Back to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="product-detail">
      <div className="product-detail-image">
        <img
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="product-detail-info">
        <p className="section-small">
          {product.category}
        </p>

        <h1>{product.name}</h1>

        <p className="detail-price">
          {product.price}
        </p>

        <p className="detail-description">
          {product.description}
        </p>

        <button
          className="primary-btn"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>

        <Link to="/shop" className="back-link">
          ← Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default ProductDetails;