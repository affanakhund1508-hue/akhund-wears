import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPictureBox from "../components/AdminPictureBox";
import {
  getGallery,
  getRawImages,
  resolveImage,
  uploadImage,
} from "../utils/images";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  description: "",
  images: [],
  stock: "",
};

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const getToken = () => {
    return sessionStorage.getItem("adminToken");
  };

  // Existing categories, used as suggestions in the form
  const categories = [
    ...new Set(
      products.map((product) => product.category).filter(Boolean)
    ),
  ];

  // Login expired or invalid: clear it and go back to the login page
  const handleSessionExpired = () => {
    sessionStorage.removeItem("adminToken");
    alert("Your admin session expired. Please log in again.");
    navigate("/admin/login", { replace: true });
  };

  const isAuthError = (response) =>
    response.status === 401 || response.status === 403;

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
    setForm(emptyForm);
    setEditingId(null);
  };

  // ----- Product pictures -----

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);

    // Clear the input so the same file can be chosen again later
    e.target.value = "";

    if (files.length === 0) return;

    const token = getToken();

    if (!token) {
      handleSessionExpired();
      return;
    }

    setUploading(true);

    try {
      for (const file of files) {
        const url = await uploadImage(file, token);

        setForm((current) => ({
          ...current,
          images: [...current.images, url],
        }));
      }
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        handleSessionExpired();
      } else {
        alert(error.message || "Could not upload the picture.");
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index),
    }));
  };

  const makeMainImage = (index) => {
    setForm((current) => ({
      ...current,
      images: [
        current.images[index],
        ...current.images.filter((_, i) => i !== index),
      ],
    }));
  };

  // ----- Products -----

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      handleSessionExpired();
      return;
    }

    const productData = {
      ...form,
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      // "image" keeps the first picture, so older code still works
      image: form.images[0] || "",
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

      if (isAuthError(response)) {
        handleSessionExpired();
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || "Something went wrong.");
        return;
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Product save error:", error);

      alert("Could not connect to the server.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      images: getRawImages(product),
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
      handleSessionExpired();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (isAuthError(response)) {
        handleSessionExpired();
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || "Could not delete product.");
        return;
      }

      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);

      alert("Could not connect to the server.");
    }
  };

  return (
    <main className="page">
      <div className="page-heading">
        <p className="section-small">AKHUND WEARS</p>

        <h1>Product Management</h1>
      </div>

      <AdminPictureBox
        title="Home Page Top Pictures"
        field="heroImages"
        defaultSrc="/images/hero.png"
        hint="Choose one or more wide pictures for the top of the home page. With two or more, the website shows them as a slideshow."
      />

      <AdminPictureBox
        title="Home Page Culture Banner Pictures"
        field="cultureImages"
        defaultSrc="/images/culture-banner.png"
        hint="Choose one or more pictures for the Tradition in Every Detail banner. With two or more, the website shows them as a slideshow."
      />

      <form onSubmit={handleSubmit} className="admin-form">
        <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />

        <input
          name="category"
          list="category-options"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />

        <datalist id="category-options">
          {categories.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>

        <p className="admin-hint">
          Pick an existing category, or type a new one to create it.
          It appears in the Shop filter automatically.
        </p>

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

        <p className="admin-label">Pictures</p>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          disabled={uploading}
        />

        <p className="admin-hint">
          {uploading
            ? "Uploading..."
            : "Choose photos from your gallery, files or camera. The first picture is the main one. With two or more, customers get an arrow to see the next picture."}
        </p>

        {form.images.length > 0 && (
          <div className="upload-list">
            {form.images.map((src, index) => (
              <div className="upload-item" key={`${src}-${index}`}>
                <img src={resolveImage(src)} alt={`Picture ${index + 1}`} />

                {index === 0 && (
                  <span className="upload-badge">Main</span>
                )}

                <div className="upload-item-actions">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => makeMainImage(index)}
                    >
                      Make main
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
        />

        <div className="admin-actions">
          <button
            className="primary-btn"
            type="submit"
            disabled={uploading}
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h2>Products</h2>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="admin-list">
            {products.map((product) => {
              const gallery = getGallery(product);

              return (
                <div key={product._id} className="admin-card">
                  <div className="admin-product-row">
                    {gallery[0] && (
                      <img
                        src={gallery[0]}
                        alt={product.name}
                        className="admin-thumb"
                      />
                    )}

                    <div>
                      <h3>{product.name}</h3>

                      <p>Category: {product.category}</p>

                      <p>
                        Price: Rs. {product.price.toLocaleString()}
                      </p>

                      <p>Stock: {product.stock}</p>

                      <p>
                        Pictures: {gallery.length}
                      </p>
                    </div>
                  </div>

                  <div className="admin-actions">
                    <button
                      className="primary-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="secondary-btn"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminProducts;
