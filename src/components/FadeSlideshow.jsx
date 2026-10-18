import { useEffect, useState } from "react";

// Shows several pictures one after another, fading between them.
// With one picture it just shows it. Put it inside a box that has
// "position: relative" (the hero and the culture banner do).
function FadeSlideshow({
  images,
  alt,
  imageClass = "",
  interval = 5000,
}) {
  const [index, setIndex] = useState(0);

  const count = images.length;

  // Stay safe if the list of pictures gets shorter
  const current = Math.min(index, Math.max(count - 1, 0));

  useEffect(() => {
    if (count < 2) return undefined;

    // Restarts the timer whenever the picture changes, so choosing a
    // dot by hand gets a full pause before the next automatic change
    const timer = setTimeout(() => {
      setIndex((current + 1) % count);
    }, interval);

    return () => clearTimeout(timer);
  }, [current, count, interval]);

  return (
    <>
      {images.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={i === current ? alt : ""}
          aria-hidden={i === current ? undefined : true}
          className={`${imageClass} fade-slide${
            i === current ? " active" : ""
          }`}
        />
      ))}

      {count > 1 && (
        <div className="fade-dots">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              className={i === current ? "active" : ""}
              onClick={() => setIndex(i)}
              aria-label={`Show picture ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default FadeSlideshow;
