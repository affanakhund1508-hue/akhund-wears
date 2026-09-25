import { Link } from "react-router-dom";

function Cart({ cart, onRemove, onIncrease, onDecrease }) {
  const total = cart.reduce(
    (sum, item) => sum + item.numericPrice * item.quantity,
    0
  );

  return (
    <main className="page">
      <div className="page-heading">
        <p className="section-small">YOUR BAG</p>
        <h1>Shopping Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty.</h2>
          <p>Discover something from our collection.</p>

          <Link to="/shop" className="primary-btn">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>

                  <div className="quantity">
                    <button onClick={() => onDecrease(item.id)}>
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => onIncrease(item.id)}>
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div>
              <span>Subtotal</span>
              <strong>Rs. {total.toLocaleString()}</strong>
            </div>

            <div>
              <span>Delivery</span>
              <strong>Calculated at checkout</strong>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <strong>Rs. {total.toLocaleString()}</strong>
            </div>

            <Link to="/checkout" className="primary-btn full-btn">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;