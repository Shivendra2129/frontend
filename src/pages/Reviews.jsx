// src/pages/Reviews.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";

export default function Reviews() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    API.get(`/products/${productId}`)
      .then(res => setProduct(res.data))
      .catch(() => {});
    API.get(`/reviews/${productId}`)
      .then(res => setReviews(res.data))
      .catch(() => {});
  }, [productId]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error("Please provide rating"); return; }
    try {
      await API.post("/reviews", { product: productId, rating: Number(rating), comment });
      setReviews([...reviews, { rating: Number(rating), comment, customer: { name: "You" } }]);
      setRating(5); setComment("");
      toast.success("Review added");
    } catch {
      toast.error("Failed to add review");
    }
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : "—";

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        {product && (
          <>
            <img src={product.imageURL || "/placeholder.png"} alt={product.name} style={{ width: 100, height: 80, objectFit: "cover" }} className="me-3 rounded" />
            <div>
              <h4 className="mb-0">{product.name}</h4>
              <small className="text-muted">₹{product.price} • {product.category}</small>
            </div>
          </>
        )}
      </div>

      <div className="mb-4">
        <h5>Reviews <small className="text-muted">({reviews.length})</small></h5>
        <p>Average rating: <strong>{avgRating}</strong></p>
        {reviews.length === 0 && <p className="text-muted">No reviews yet — be the first to review!</p>}
        {reviews.map((r, i) => (
          <div key={i} className="border p-3 mb-2 rounded">
            <div className="d-flex justify-content-between">
              <div><b>{r.customer?.name || "Customer"}</b></div>
              <div>⭐ {r.rating}</div>
            </div>
            <p className="mb-0">{r.comment}</p>
          </div>
        ))}
      </div>

      <div className="card p-3 shadow-sm">
        <h6 className="mb-2">Add your review</h6>
        <form onSubmit={submitReview}>
          <div className="mb-2">
            <label className="form-label">Rating</label>
            <select className="form-select w-auto" value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Very good</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Fair</option>
              <option value={1}>1 - Poor</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label">Comment</label>
            <textarea className="form-control" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>

          <button className="btn btn-success">Submit Review</button>
        </form>
      </div>
    </div>
  );
}
