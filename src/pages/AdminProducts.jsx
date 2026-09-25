import { useEffect, useState } from "react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
    stock: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const getToken = () => {
    return sessionStorage.getItem("adminToken");
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/products`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      description: "",
      image: "",
      stock: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      alert("Admin login required.");
      return;
    }

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    const url = editingId
      ? `${API_URL}/products/${editingId}`
      : `${API_URL}/products`;

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Something went wrong."
        );
        return;
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(
        "Product save error:",
        error
      );

      alert(
        "Could not connect to the server."
      );
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      image: product.image,
      stock: product.stock,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    const token = getToken();

    if (!token) {
      alert("Admin login required.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Could not delete product."
        );
        return;
      }

      fetchProducts();
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(
        "Could not connect to the server."
      );
    }
  };

  return (
    <main className="page">
      <div className="page-heading">
        <p className="section-small">
          AKHUND WEARS
        </p>

        <h1>Product Management</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          marginBottom: "40px",
        }}
      >
        <h2>
          {editingId
            ? "Edit Product"
            : "Add Product"}
        </h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows="4"
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="/images/product.png"
        />

        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
        />

        <button
          className="primary-btn"
          type="submit"
        >
          {editingId
            ? "Update Product"
            : "Add Product"}
        </button>

        {editingId && (
          <button
            type="button"
            className="secondary-btn"
            onClick={resetForm}
            style={{
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div>
        <h2>Products</h2>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "15px",
              }}
            >
              <h3>{product.name}</h3>

              <p>
                Category: {product.category}
              </p>

              <p>
                Price: Rs.{" "}
                {product.price.toLocaleString()}
              </p>

              <p>
                Stock: {product.stock}
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  handleEdit(product)
                }
              >
                Edit
              </button>

              <button
                className="secondary-btn"
                onClick={() =>
                  handleDelete(product._id)
                }
                style={{
                  marginLeft: "10px",
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default AdminProducts;
