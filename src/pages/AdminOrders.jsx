import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token =
        sessionStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Could not load orders");
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="page simple-page">
        <h1>Loading orders...</h1>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-heading">
        <p className="section-small">
          AKHUND WEARS
        </p>

        <h1>Orders</h1>

        <p>
          View customer orders and delivery
          information.
        </p>
      </div>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            >
              <h3>
                Order #{order._id}
              </h3>

              <p>
                <strong>Name:</strong>{" "}
                {order.customer.name}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {order.customer.phone}
              </p>

              <p>
                <strong>City:</strong>{" "}
                {order.customer.city}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {order.customer.address}
              </p>

              <h4>Products</h4>

              {order.items.map((item) => (
                <p key={item._id}>
                  {item.name} × {item.quantity} — Rs.{" "}
                  {(
                    item.price * item.quantity
                  ).toLocaleString()}
                </p>
              ))}

              <hr />

              <p>
                <strong>
                  Total: Rs.{" "}
                  {order.total.toLocaleString()}
                </strong>
              </p>

              <p>
                <strong>Payment:</strong>{" "}
                {order.paymentMethod}
              </p>

              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default AdminOrders;
