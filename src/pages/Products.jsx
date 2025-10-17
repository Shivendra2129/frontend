import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="row">
      {products.map((p) => (
        <div className="col-md-3 mb-4" key={p._id}>
          <div className="card h-100">
            <img src={p.imageURL} className="card-img-top" alt={p.name} />
            <div className="card-body">
              <h5>{p.name}</h5>
              <p>₹{p.price} / kg</p>
              <Link to={`/reviews/${p._id}`} className="btn btn-success btn-sm">Reviews</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
