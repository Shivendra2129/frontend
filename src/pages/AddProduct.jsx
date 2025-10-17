// src/pages/AddProduct.jsx
import { useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const categories = ["Vegetables", "Fruits", "Grains", "Dairy", "Other"];

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "Vegetables",
    price: "",
    stock: "",
    imageURL: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price) {
      toast.error("Please enter at least name and price.");
      return;
    }

    try {
      await API.post("/products", {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock || 0)
      });
      toast.success("Product added successfully");
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to add product");
    }
  };

  return (
    <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 720 }}>
      <h4 className="mb-3">Add New Product</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label">Name*</label>
          <input name="name" value={product.name} onChange={handleChange} className="form-control" placeholder="e.g. Fresh Tomatoes" />
        </div>

        <div className="mb-2">
          <label className="form-label">Description</label>
          <textarea name="description" value={product.description} onChange={handleChange} className="form-control" rows={3} />
        </div>

        <div className="row">
          <div className="col-md-4 mb-2">
            <label className="form-label">Category</label>
            <select name="category" value={product.category} onChange={handleChange} className="form-select">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="col-md-4 mb-2">
            <label className="form-label">Price (₹ per unit)</label>
            <input name="price" value={product.price} onChange={handleChange} type="number" className="form-control" />
          </div>

          <div className="col-md-4 mb-2">
            <label className="form-label">Stock (quantity)</label>
            <input name="stock" value={product.stock} onChange={handleChange} type="number" className="form-control" />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input name="imageURL" value={product.imageURL} onChange={handleChange} className="form-control" placeholder="https://..." />
        </div>

        <button className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
}
