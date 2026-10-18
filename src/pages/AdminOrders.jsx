import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUSES = ["Pending", "Delivered", "Cancelled"];

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const getToken = () => sessionStorage.getItem("adminToken");

  // Login expired or invalid: clear it and go back to the login page
  const handleSessionExpired = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  };

  const isAuthError = (response) =>
    response.status === 401 || response.status === 403;

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (isAuthError(response)) {
        handleSessionExpired();
        return;
      }

      if (!response.ok) {
        throw new Error("Could not load orders");
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoadError("Could not load orders. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_URL}/orders/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (isAuthError(response)) {
        handleSessionExpired();
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || "Could not update the status.");
        return;
      }

      setOrders((current) =>
        current.map((order) =>
          order._id === id ? data : order
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert("Could not connect to the server.");
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this order? This cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (isAuthError(response)) {
        handleSessionExpired();
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || "Could not delete the order.");
        return;
      }

      setOrders((current) =>
        current.filter((order) => order._id !== id)
      );
    } catch (error) {
      console.error("Delete order error:", error);
      alert("Could not connect to the server.");
    }
  };

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
        <p className="section-small">AKHUND WEARS</p>

        <h1>Orders</h1>

        <p>View customer orders and delivery information.</p>
      </div>

      {loadError && <p className="admin-error">{loadError}</p>}

      {!loadError && orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="admin-list">
          {orders.map((order) => {
            const status = order.status || "Pending";

            return (
              <div key={order._id} className="admin-card">
                <div className="admin-card-header">
                  <h3>Order #{order._id.slice(-6)}</h3>

                  <span
                    className={`status-badge status-${status.toLowerCase()}`}
                  >
                    {status}
                  </span>
                </div>

                <p>
                  <strong>Name:</strong> {order.customer?.name}
                </p>

                <p>
                  <strong>Phone:</strong> {order.customer?.phone}
                </p>

                <p>
                  <strong>City:</strong> {order.customer?.city}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {order.customer?.address}
                </p>

                <h4>Products</h4>

                {order.items.map((item) => (
                  <p key={item._id}>
                    {item.name} × {item.quantity} — Rs.{" "}
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                ))}

                <hr />

                <p>
                  <strong>
                    Total: Rs. {order.total.toLocaleString()}
                  </strong>
                </p>

                <p>
                  <strong>Payment:</strong> {order.paymentMethod}
                </p>

                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <div className="admin-actions">
                  <select
                    value={status}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    {STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => deleteOrder(order._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default AdminOrders;
