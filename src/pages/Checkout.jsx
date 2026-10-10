
import { Link } from "react-router-dom";

function Checkout({ cart, onPlaceOrder, orderPlaced }) {
  const total = cart.reduce(
    (sum, item) => sum + item.numericPrice * item.quantity,
    0
  );

  if (orderPlaced) {
    return (
      <main className="page simple-page">
        <p className="section-small">AKHUND WEARS</p>

        <h1>Order Confirmed</h1>

        <p>
          Thank you for your order. We will contact you shortly
          to confirm your delivery details.
        </p>

        <br />

        <Link to="/shop" className="primary-btn">
          Continue Shopping
        </Link>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="page simple-page">
        <h1>Your cart is empty.</h1>

        <p>Add some products before checking out.</p>

        <br />

        <Link to="/shop" className="primary-btn">
          Go to Shop
        </Link>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const orderData = {
      customer: {
        name: form.name.value,
        phone: form.phone.value,
        city: form.city.value,
        address: form.address.value,
      },

      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.numericPrice,
        quantity: item.quantity,
      })),

      total: total,

      paymentMethod: "Cash on Delivery",
    };

    try {
   const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      await response.json();

      onPlaceOrder();
    } catch (error) {
      console.error("Order error:", error);
      alert("Could not place order. Please try again.");
    }
  };

  return (
    <main className="page">
      <div className="page-heading">
        <p className="section-small">ORDER</p>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <h2>Delivery Information</h2>

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            required
          />

          <input
            name="city"
            type="text"
            placeholder="City"
            required
          />

          <textarea
            name="address"
            placeholder="Complete Delivery Address"
            rows="5"
            required
          ></textarea>

          <h2>Payment</h2>

          <div className="payment-option">
            <input
              type="radio"
              checked
              readOnly
            />

            <span>Cash on Delivery</span>
          </div>

          <button
            className="primary-btn full-btn"
            type="submit"
          >
            Place Order
          </button>
        </form>

        <div className="checkout-summary">
          <h2>Your Order</h2>

          {cart.map((item) => (
            <div
              className="checkout-item"
              key={item.id}
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                Rs.{" "}
                {(
                  item.numericPrice * item.quantity
                ).toLocaleString()}
              </strong>
            </div>
          ))}

          <hr />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              Rs. {total.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;