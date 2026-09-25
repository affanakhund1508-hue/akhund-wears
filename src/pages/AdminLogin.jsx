import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      sessionStorage.setItem("adminToken", data.token);

      navigate("/admin/orders");
    } catch (error) {
      setError("Could not connect to server");
    }
  };

  return (
    <main className="page simple-page">
      <p className="section-small">AKHUND WEARS</p>

      <h1>Admin Login</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "400px",
          margin: "30px auto",
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="primary-btn"
        >
          Login
        </button>
      </form>
    </main>
  );
}

export default AdminLogin;
