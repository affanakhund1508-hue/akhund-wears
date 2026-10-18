import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resolveImage } from "../utils/images";

const DEFAULT_HERO = "/images/hero.png";

function Hero() {
  // null means "still checking which picture to show"
  const [heroSrc, setHeroSrc] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/settings`)
      .then((res) => res.json())
      .then((data) =>
        setHeroSrc(resolveImage(data.heroImage) || DEFAULT_HERO)
      )
      .catch(() => setHeroSrc(DEFAULT_HERO));
  }, []);

  return (
    <section className="hero">
      {heroSrc && (
        <img
          src={heroSrc}
          alt="Akhund Wears traditional collection"
          className="hero-img"
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
