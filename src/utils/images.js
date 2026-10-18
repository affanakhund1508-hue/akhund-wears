const API_URL = import.meta.env.VITE_API_URL || "";

// Longest side of an uploaded picture, in pixels.
// Big phone photos are shrunk to this size before upload.
const MAX_SIDE = 1200;

// Pictures uploaded from the admin page are saved as "/api/images/<id>".
// This turns that into a full address that points at the backend.
// Other addresses (/images/pakol.png, https://...) are left as they are.
export function resolveImage(src) {
  if (!src) return "";

  if (src.startsWith("/api/")) {
    return `${API_URL}${src.slice(4)}`;
  }

  return src;
}

// The saved picture paths of a product, in order.
// Older products that only have one "image" still work.
export function getRawImages(product) {
  if (!product) return [];

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }

  return product.image ? [product.image] : [];
}

// The pictures of a product, ready to use in <img src="...">
export function getGallery(product) {
  return getRawImages(product).map(resolveImage);
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file is not a picture we can use."));
    };

    img.src = url;
  });
}

// Shrinks a picture and returns it as a JPEG data URL
export async function fileToDataUrl(file) {
  const img = await loadImage(file);

  const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  // White behind the picture, so transparent PNGs don't turn black
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.82);
}

// Shrinks a picture and uploads it. Returns its saved path.
export async function uploadImage(file, token) {
  const dataUrl = await fileToDataUrl(file);

  const response = await fetch(`${API_URL}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ dataUrl }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      response.status === 413
        ? "That picture is too large."
        : data.message || "Could not upload the picture."
    );

    error.status = response.status;
    throw error;
  }

  return data.url;
}
