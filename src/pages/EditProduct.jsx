import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";

const categories = ["Vegetables", "Fruits", "Grains", "Dairy", "Other"];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "Vegetables",
    price: "",
    stock: "",
    imageURL: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await API.get(`/products/${id}`);
      const productData = response.data;
      setProduct({
        name: productData.name || "",
        description: productData.description || "",
        category: productData.category || "Vegetables",
        price: productData.price || "",
        stock: productData.stock || "",
        imageURL: productData.imageURL || ""
      });
    } catch (error) {
      toast.error("Failed to load product details");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price) {
      toast.error("Please enter at least name and price.");
      return;
    }

    try {
      await API.put(`/products/${id}`, {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock || 0)
      });
      toast.success("Product updated successfully");
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 720 }}>
      <h4 className="mb-3">Edit Product</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label">Name*</label>
          <input 
            name="name" 
            value={product.name} 
            onChange={handleChange} 
            className="form-control" 
            placeholder="e.g. Fresh Tomatoes" 
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Description</label>
          <textarea 
            name="description" 
            value={product.description} 
            onChange={handleChange} 
            className="form-control" 
            rows={3} 
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-2">
            <label className="form-label">Category</label>
            <select 
              name="category" 
              value={product.category} 
              onChange={handleChange} 
              className="form-select"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-2">
            <label className="form-label">Price (₹ per unit)*</label>
            <input 
              name="price" 
              value={product.price} 
              onChange={handleChange} 
              type="number" 
              className="form-control" 
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="col-md-4 mb-2">
            <label className="form-label">Stock (quantity)</label>
            <input 
              name="stock" 
              value={product.stock} 
              onChange={handleChange} 
              type="number" 
              className="form-control" 
              min="0"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input 
            name="imageURL" 
            value={product.imageURL} 
            onChange={handleChange} 
            className="form-control" 
            placeholder="https://..." 
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Update Product
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate("/products")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
