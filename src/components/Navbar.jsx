import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  AboutIcon,
  CartIcon,
  ContactIcon,
  HomeIcon,
  LogoutIcon,
  OrdersIcon,
  ProductsIcon,
  ShopIcon,
} from "./NavIcons";

// One link of the menu: an icon with its name written below it
// on phones, and just the name on bigger screens.
function NavItem({ to, end, icon, label }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        isActive ? "nav-item active" : "nav-item"
      }
    >
      {icon}
      <span className="nav-label">{label}</span>
    </NavLink>
  );
}

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
          <NavItem to="/" end icon={<HomeIcon />} label="Home" />
          <NavItem to="/shop" icon={<ShopIcon />} label="Shop" />
          <NavItem to="/about" icon={<AboutIcon />} label="About" />
          <NavItem
            to="/contact"
            icon={<ContactIcon />}
            label="Contact"
          />

          {isAdmin && (
            <div className="nav-admin">
              <NavItem
                to="/admin/orders"
                icon={<OrdersIcon />}
                label="Orders"
              />
              <NavItem
                to="/admin/products"
                icon={<ProductsIcon />}
                label="Products"
              />
              <button
                type="button"
                className="nav-item nav-logout"
                onClick={handleLogout}
              >
                <LogoutIcon />
                <span className="nav-label">Logout</span>
              </button>
            </div>
          )}
        </div>

        <Link to="/cart" className="cart-link nav-item">
          <CartIcon />
          <span className="nav-label">Cart</span>
          <span className="cart-count">{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
