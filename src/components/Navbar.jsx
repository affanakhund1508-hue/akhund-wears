import { Link } from "react-router-dom";

function Navbar({ cartCount }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          Akhund <span>Wears</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <Link to="/cart" className="cart-link">
          Cart
          <span className="cart-count">{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;