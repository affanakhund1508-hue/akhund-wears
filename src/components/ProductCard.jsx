import { Link } from "react-router-dom";

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-link">
        <img src={product.image} alt={product.name} />
      </Link>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <Link to={`/product/${product.id}`} className="product-title">
          <h3>{product.name}</h3>
        </Link>

        <div className="product-bottom">
          <p className="product-price">{product.price}</p>

          <button onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;