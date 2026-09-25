import { useState } from "react";

function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    e.target.reset();
  };

  return (
    <main className="page simple-page">
      <p className="section-small">GET IN TOUCH</p>

      <h1>Contact Us</h1>

      <p>
        Have a question about a product or your order? Send us a message.
      </p>

      {sent && (
        <p
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#e5efe8",
          }}
        >
          Thank you! Your message has been received.
        </p>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          required
        />

        <input
          type="email"
          placeholder="Your Email"
          required
        />

        <input
          type="text"
          placeholder="Subject"
        />

        <textarea
          placeholder="Your Message"
          rows="6"
          required
        ></textarea>

        <button type="submit" className="primary-btn">
          Send Message
        </button>
      </form>
    </main>
  );
}

export default Contact;