import { useState, useEffect } from "react";

export default function DesignsPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const [designs, setDesigns] = useState([]);
  const [orders, setOrders] = useState([]);

  // Load saved data
  useEffect(() => {
    const savedDesigns = JSON.parse(localStorage.getItem("designs")) || [];
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    setDesigns(savedDesigns);
    setOrders(savedOrders);
  }, []);

  // Admin login
  const handleLogin = () => {
    const password = prompt("Enter admin password:");
    if (password === "mom123") {
      setIsAdmin(true);
    } else {
      alert("Wrong password");
    }
  };

  // Upload design
  const handleUpload = () => {
    if (!name || !price || !image) {
      alert("Fill all fields!");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const newDesign = {
        id: Date.now(),
        name,
        price,
        image: reader.result, // saves image properly
      };

      const updated = [...designs, newDesign];

      setDesigns(updated);
      localStorage.setItem("designs", JSON.stringify(updated));

      setName("");
      setPrice("");
      setImage(null);
    };

    reader.readAsDataURL(image);
  };

  // Order design
  const handleOrder = (design) => {
    const customerName = prompt("Enter your name:");
    const phone = prompt("Enter your phone number:");

    if (!customerName || !phone) return;

    const newOrder = {
      id: Date.now(),
      designName: design.name,
      price: design.price,
      customerName,
      phone,
    };

    const updatedOrders = [...orders, newOrder];

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    alert("Order placed successfully!");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>✨ Custom Design Store</h1>

      {/* ADMIN LOGIN */}
      {!isAdmin && (
        <button onClick={handleLogin}>Admin Login</button>
      )}

      {/* UPLOAD (ONLY ADMIN) */}
      {isAdmin && (
        <div style={{ marginTop: "20px" }}>
          <h2>Upload Design (Mom)</h2>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <br />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <br />

          <button onClick={handleUpload}>Upload</button>
        </div>
      )}

      {/* DESIGNS */}
      <h2 style={{ marginTop: "30px" }}>Available Designs</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {designs.map((design) => (
          <div
            key={design.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "10px",
              width: "200px",
            }}
          >
            <img
              src={design.image}
              alt=""
              style={{ width: "100%", borderRadius: "10px" }}
            />
            <h3>{design.name}</h3>
            <p>₹ {design.price}</p>

            <button onClick={() => handleOrder(design)}>
              Order Now
            </button>
          </div>
        ))}
      </div>

      {/* ORDERS (ONLY ADMIN) */}
      {isAdmin && (
        <div style={{ marginTop: "30px" }}>
          <h2>Orders</h2>

          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} style={{ marginBottom: "10px" }}>
                <b>{order.customerName}</b> ordered{" "}
                <b>{order.designName}</b> (₹{order.price}) <br />
                📞 {order.phone}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}