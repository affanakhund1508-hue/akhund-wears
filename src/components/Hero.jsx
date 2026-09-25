import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <img
        src="/images/hero.png"
        alt="Akhund Wears traditional collection"
        className="hero-img"
      />

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