import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { createOrder, fetchDesign, toAssetUrl } from "../api";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

const initialForm = {
  customer_name: "",
  phone: "",
  address: "",
};

export function OrderPage() {
  const { designId } = useParams();
  const [design, setDesign] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [pageStatus, setPageStatus] = useState("loading");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadDesign() {
      setPageStatus("loading");
      setError("");

      try {
        const response = await fetchDesign(designId);
        if (!ignore) {
          setDesign(response);
          setPageStatus("ready");
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
          setPageStatus("error");
        }
      }
    }

    loadDesign();

    return () => {
      ignore = true;
    };
  }, [designId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitStatus("submitting");
    setError("");

    try {
      const order = await createOrder({
        ...form,
        design_id: Number(designId),
      });

      setCreatedOrder(order);
      setSubmitStatus("success");
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError.message);
      setSubmitStatus("error");
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  if (pageStatus === "loading") {
    return (
      <section className="state-card">
        <div className="spinner" aria-hidden="true" />
        <p>Loading design details...</p>
      </section>
    );
  }

  if (pageStatus === "error") {
    return (
      <section className="state-card state-card--error">
        <h1>Could not load design</h1>
        <p>{error}</p>
        <Link className="button button--secondary" to="/">
          Back to designs
        </Link>
      </section>
    );
  }

  return (
    <div className="order-layout">
      <section className="detail-card">
        <Link className="back-link" to="/">
          Back to designs
        </Link>

        <div className="detail-image-wrap">
          <img className="detail-image" src={toAssetUrl(design.image_path)} alt={design.name} />
        </div>

        <div className="detail-copy">
          <span className="eyebrow">Selected design</span>
          <h1>{design.name}</h1>
          <p className="price">{formatPrice(design.price)}</p>
          <p className="detail-note">
            Fill out the form to create an order directly through the backend API.
          </p>
        </div>
      </section>

      <section className="form-card">
        {submitStatus === "success" && createdOrder ? (
          <div className="success-card">
            <span className="eyebrow">Order submitted</span>
            <h2>Order #{createdOrder.id} created successfully</h2>
            <p>
              The order has been saved for <strong>{createdOrder.customer_name}</strong>.
            </p>
            <Link className="button button--primary" to="/">
              Browse more designs
            </Link>
          </div>
        ) : (
          <>
            <div className="form-heading">
              <span className="eyebrow">Create order</span>
              <h2>Customer details</h2>
              <p>Submit the name, phone number, and address for this design.</p>
            </div>

            <form className="order-form" onSubmit={handleSubmit}>
              <label>
                <span>Name</span>
                <input
                  type="text"
                  name="customer_name"
                  value={form.customer_name}
                  onChange={updateField}
                  required
                />
              </label>

              <label>
                <span>Phone number</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  required
                />
              </label>

              <label>
                <span>Address</span>
                <textarea
                  name="address"
                  rows="5"
                  value={form.address}
                  onChange={updateField}
                  required
                />
              </label>

              {error ? <p className="form-error">{error}</p> : null}

              <button
                className="button button--primary button--full"
                type="submit"
                disabled={submitStatus === "submitting"}
              >
                {submitStatus === "submitting" ? "Submitting order..." : "Submit Order"}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
