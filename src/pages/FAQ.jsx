function FAQ() {
  return (
    <main className="page simple-page">
      <p className="section-small">HELP</p>

      <h1>Frequently Asked Questions</h1>

      <div className="faq-list">
        <details>
          <summary>Do you offer Cash on Delivery?</summary>
          <p>Yes, Cash on Delivery will be available for eligible orders.</p>
        </details>

        <details>
          <summary>How long does delivery take?</summary>
          <p>Delivery times depend on your location and order.</p>
        </details>

        <details>
          <summary>Can I return a product?</summary>
          <p>
            Return and exchange conditions will depend on the product and
            order.
          </p>
        </details>

        <details>
          <summary>Where do your products come from?</summary>
          <p>
            We aim to source traditional products from craftsmen and
            suppliers across Pakistan.
          </p>
        </details>
      </div>
    </main>
  );
}

export default FAQ;