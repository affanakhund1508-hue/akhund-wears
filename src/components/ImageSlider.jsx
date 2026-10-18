import { useState } from "react";
import { Link } from "react-router-dom";

// Shows the first picture, with arrows and dots when there are more.
// Pass "to" to make the picture a link (used on product cards).
function ImageSlider({ images, alt, to, imageClass = "slider-box" }) {
  const [index, setIndex] = useState(0);

  const count = images.length;

  // Stay safe if the list of pictures gets shorter
  const current = Math.min(index, Math.max(count - 1, 0));

  const go = (event, step) => {
    // The arrows sit on top of a link, so don't open the product page
    event.preventDefault();
    event.stopPropagation();

    setIndex((current + step + count) % count);
  };

  const picture =
    count > 0 ? <img src={images[current]} alt={alt} /> : null;

  return (
    <div className="slider">
      {to ? (
        <Link to={to} className={imageClass}>
          {picture}
        </Link>
      ) : (
        <div className={imageClass}>{picture}</div>
      )}

      {count > 1 && (
        <>
          <button
            type="button"
            className="slider-arrow slider-prev"
            onClick={(event) => go(event, -1)}
            aria-label="Previous picture"
          >
            ‹
          </button>

          <button
            type="button"
            className="slider-arrow slider-next"
            onClick={(event) => go(event, 1)}
            aria-label="Next picture"
          >
            ›
          </button>

          <div className="slider-dots">
            {images.map((src, i) => (
              <span
                key={`${src}-${i}`}
                className={
                  i === current ? "slider-dot active" : "slider-dot"
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ImageSlider;
