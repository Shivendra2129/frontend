// src/pages/Home.jsx
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { Link } from "react-router-dom";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => setFeatured(res.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="p-5 rounded bg-light mb-4 shadow-sm">
        <h1 className="display-5">Fresh produce directly from farmers</h1>
        <p className="lead">Organic, local, and affordable — delivered with trust.</p>
        <Link to="/products" className="btn btn-success btn-lg">Shop Now</Link>
      </div>

      <h4 className="mb-3">Featured Produce</h4>
      <div className="row">
        {featured.map((p) => (
          <div className="col-md-4 mb-4" key={p._id}>
            <div className="card h-100 shadow-sm">
              <img
                src={p.imageURL || "/placeholder.png"}
                className="card-img-top"
                alt={p.name}
                style={{ height: 200, objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text text-truncate">{p.description || "No description provided."}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <strong>₹{p.price}</strong>
                  <Link to={`/reviews/${p._id}`} className="btn btn-outline-primary btn-sm">Reviews</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        {featured.length === 0 && <p className="text-muted">No products to show yet.</p>}
      </div>
    </div>
  );
}
