import { Link, useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import { getGallery } from "../utils/images";

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    onAddToCart(product);
    navigate("/checkout");
  };

  return (
    <div className="product-card">
      <ImageSlider
        images={getGallery(product)}
        alt={product.name}
        to={`/product/${product.id}`}
        imageClass="product-image-link"
      />

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <Link to={`/product/${product.id}`} className="product-title">
          <h3>{product.name}</h3>
        </Link>

        <div className="product-bottom">
          <p className="product-price">{product.price}</p>

          <div className="product-actions">
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>

            <button onClick={() => onAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
