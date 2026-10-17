import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar({ cartCount }) {
  const navigate = useNavigate();

  // Re-read on every route change, so the admin links appear right after login
  useLocation();
  const isAdmin = Boolean(sessionStorage.getItem("adminToken"));

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/");
  };

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

          {isAdmin && (
            <>
              <Link to="/admin/orders">Orders</Link>
              <Link to="/admin/products">Products</Link>
              <button
                type="button"
                className="nav-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
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
