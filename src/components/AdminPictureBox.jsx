import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveImage, uploadImage } from "../utils/images";

const MAX_PICTURES = 6;

// A box on the admin page for one group of home page pictures
// (for example the hero). With two or more pictures the website
// shows them as a slideshow.
//
// field: "heroImages" or "cultureImages"
function AdminPictureBox({ title, field, defaultSrc, hint }) {
  const navigate = useNavigate();

  const [pictures, setPictures] = useState([]);
  const [busy, setBusy] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const getToken = () => sessionStorage.getItem("adminToken");

  // Login expired or invalid: clear it and go back to the login page
  const handleSessionExpired = () => {
    sessionStorage.removeItem("adminToken");
    alert("Your admin session expired. Please log in again.");
    navigate("/admin/login", { replace: true });
  };

  const isAuthError = (error) =>
    error.status === 401 || error.status === 403;

  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then((res) => res.json())
      .then((data) =>
        setPictures(Array.isArray(data[field]) ? data[field] : [])
      )
      .catch((error) =>
        console.error("Error fetching settings:", error)
      );
  }, [API_URL, field]);

  // Saves the full list of pictures. Throws if it fails.
  const save = async (list) => {
    const response = await fetch(`${API_URL}/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ [field]: list }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(
        data.message || "Could not save the pictures."
      );
      error.status = response.status;
      throw error;
    }

    setPictures(Array.isArray(data[field]) ? data[field] : []);
  };

  const run = async (action) => {
    const token = getToken();

    if (!token) {
      handleSessionExpired();
      return;
    }

    setBusy(true);

    try {
      await action(token);
    } catch (error) {
      if (isAuthError(error)) {
        handleSessionExpired();
      } else {
        alert(error.message || "Something went wrong.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);

    // Clear the input so the same file can be chosen again later
    e.target.value = "";

    if (files.length === 0) return;

    const room = MAX_PICTURES - pictures.length;

    if (files.length > room) {
      alert(`You can have up to ${MAX_PICTURES} pictures here.`);
      return;
    }

    run(async (token) => {
      const urls = [];

      for (const file of files) {
        urls.push(await uploadImage(file, token));
      }

      await save([...pictures, ...urls]);
    });
  };

  const removePicture = (index) =>
    run(() => save(pictures.filter((_, i) => i !== index)));

  const makeFirst = (index) =>
    run(() =>
      save([
        pictures[index],
        ...pictures.filter((_, i) => i !== index),
      ])
    );

  const useOriginal = () => run(() => save([]));

  return (
    <section className="admin-card admin-hero">
      <h2>{title}</h2>

      <img
        src={resolveImage(pictures[0]) || defaultSrc}
        alt={`Current ${title}`}
        className="admin-hero-preview"
      />

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        disabled={busy || pictures.length >= MAX_PICTURES}
      />

      <p className="admin-hint">
        {busy ? "Saving..." : hint}
      </p>

      {pictures.length > 0 && (
        <div className="upload-list">
          {pictures.map((src, index) => (
            <div className="upload-item" key={`${src}-${index}`}>
              <img
                src={resolveImage(src)}
                alt={`Picture ${index + 1}`}
              />

              {index === 0 && (
                <span className="upload-badge">First</span>
              )}

              <div className="upload-item-actions">
                {index > 0 && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => makeFirst(index)}
                  >
                    Make first
                  </button>
                )}

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => removePicture(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pictures.length > 0 && (
        <button
          type="button"
          className="secondary-btn"
          disabled={busy}
          onClick={useOriginal}
        >
          Use the original picture
        </button>
      )}
    </section>
  );
}

export default AdminPictureBox;
