import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h2>Akhund Wears</h2>

          <p>
            Traditional Pakistani culture, reimagined for today.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin/login">Admin</Link>
        </div>

        <div className="footer-links">
          <h3>Help</h3>

          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Shipping Questions</Link>
          <Link to="/contact">Returns & Exchange</Link>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Akhund Wears. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;