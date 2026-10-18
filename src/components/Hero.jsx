import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FadeSlideshow from "./FadeSlideshow";
import { resolveImage } from "../utils/images";

const DEFAULT_HERO = "/images/hero.png";

function Hero() {
  // null means "still checking which pictures to show"
  const [pictures, setPictures] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/settings`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data.heroImages)
          ? data.heroImages.map(resolveImage).filter(Boolean)
          : [];

        setPictures(list.length > 0 ? list : [DEFAULT_HERO]);
      })
      .catch(() => setPictures([DEFAULT_HERO]));
  }, []);

  return (
    <section className="hero">
      {pictures && (
        <FadeSlideshow
          images={pictures}
          alt="Akhund Wears traditional collection"
          imageClass="hero-img"
        />
      )}

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <p className="hero-small">HERITAGE • CULTURE • STYLE</p>

        <h1>
          Wear Your
          <br />
          Heritage
        </h1>

        <p>
          Discover traditional Pakistani products made to carry culture
          forward.
        </p>

        <Link to="/shop" className="primary-btn">
          Explore Collection
        </Link>
      </div>
    </section>
  );
}

export default Hero;
