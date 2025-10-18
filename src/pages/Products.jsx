import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isFarmer, isAdmin } = useContext(AuthContext);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await API.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");
      fetchProducts(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const canEditOrDelete = (product) => {
    return isFarmer() && product.farmer?._id === user?._id || isAdmin();
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products</h2>
        {isFarmer() && (
          <Link to="/add-product" className="btn btn-primary">
            Add New Product
          </Link>
        )}
      </div>
      
      <div className="row">
        {products.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <h4 className="text-muted">No products available</h4>
              <p className="text-muted">Check back later for fresh products!</p>
            </div>
          </div>
        ) : (
          products.map((p) => (
            <div className="col-md-3 mb-4" key={p._id}>
              <div className="card h-100 shadow-sm">
                <img 
                  src={p.imageURL || "/placeholder.png"} 
                  className="card-img-top" 
                  alt={p.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text text-muted small">{p.description}</p>
                  <div className="mb-2">
                    <span className="badge bg-secondary">{p.category}</span>
                    {p.stock > 0 ? (
                      <span className="badge bg-success ms-1">In Stock ({p.stock})</span>
                    ) : (
                      <span className="badge bg-danger ms-1">Out of Stock</span>
                    )}
                  </div>
                  <div className="mt-auto">
                    <h6 className="text-primary">₹{p.price} / kg</h6>
                    <p className="small text-muted mb-2">By: {p.farmer?.name || "Unknown"}</p>
                    
                    <div className="d-flex gap-1 flex-wrap">
                      <Link to={`/reviews/${p._id}`} className="btn btn-outline-success btn-sm">
                        Reviews
                      </Link>
                      
                      {user && p.stock > 0 && (
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            addToCart(p, 1);
                            toast.success("Added to cart!");
                          }}
                        >
                          Add to Cart
                        </button>
                      )}
                      
                      {p.stock === 0 && (
                        <button 
                          className="btn btn-outline-secondary btn-sm" 
                          disabled
                        >
                          Out of Stock
                        </button>
                      )}
                      
                      {canEditOrDelete(p) && (
                        <>
                          <Link 
                            to={`/edit-product/${p._id}`} 
                            className="btn btn-outline-warning btn-sm"
                          >
                            Edit
                          </Link>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteProduct(p._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
