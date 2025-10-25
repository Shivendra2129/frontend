import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaEdit, FaTrash, FaSearch, FaFilter, FaSort, FaEye, FaHeart } from "react-icons/fa";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const { user, isFarmer, isAdmin } = useContext(AuthContext);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

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

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const getCategories = () => {
    const categories = [...new Set(products.map(product => product.category))];
    return categories;
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

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading fresh products...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="products-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Section */}
      <motion.div 
        className="products-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="products-title">Fresh Products</h2>
            <p className="text-muted mb-0">Discover amazing produce from local farmers</p>
          </div>
          {isFarmer() && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/add-product" className="btn btn-primary btn-lg">
                <FaShoppingCart className="me-2" />
                Add New Product
              </Link>
            </motion.div>
          )}
        </div>

        {/* Search and Filter Bar */}
        <motion.div 
          className="search-filter-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="row g-3">
            <div className="col-md-6">
              <div className="search-input-group">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <div className="d-flex gap-2">
                <select
                  className="form-select filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <motion.button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowFilters(!showFilters)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaFilter />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Products Grid */}
      <motion.div 
        className="products-grid"
        variants={containerVariants}
        initial={"hidden" }
        animate="visible"
      >
        
        {filteredProducts.length === 0 ? (
          <motion.div 
            className="no-products"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center py-5">
              <div className="no-products-icon">🥬</div>
              <h4 className="text-muted mt-3">No products found</h4>
              <p className="text-muted">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Check back later for fresh products!"
                }
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <motion.button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Filters
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="row">
            <AnimatePresence>
              {filteredProducts.map((p) => (
                <motion.div 
                  className="col-md-3 mb-4" 
                  key={p._id}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  layout
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="product-card">
                    <div className="product-image-container">
                      <img 
                        src={p.imageURL || "/placeholder.png"} 
                        className="product-image" 
                        alt={p.name}
                      />
                      <div className="product-overlay">
                        <motion.button
                          className="btn btn-primary btn-sm overlay-btn"
                          onClick={() => {
                            addToCart(p, 1);
                            toast.success("Added to cart!");
                          }}
                          disabled={!user || p.stock === 0}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaShoppingCart />
                        </motion.button>
                        <Link 
                          to={`/reviews/${p._id}`} 
                          className="btn btn-outline-light btn-sm overlay-btn"
                        >
                          <FaEye />
                        </Link>
                      </div>
                      <div className="product-badges">
                        <span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {p.stock > 0 ? `In Stock (${p.stock})` : 'Out of Stock'}
                        </span>
                        <span className="badge bg-secondary">{p.category}</span>
                      </div>
                    </div>
                    
                    <div className="product-content">
                      <h5 className="product-title">{p.name}</h5>
                      <p className="product-description">{p.description}</p>
                      <div className="product-meta">
                        <div className="price-section">
                          <span className="price">₹{p.price}</span>
                          <span className="unit">/ kg</span>
                        </div>
                        <div className="farmer-info">
                          <small className="text-muted">By: {p.farmer?.name || "Unknown"}</small>
                        </div>
                      </div>
                      
                      <div className="product-actions">
                        {user && p.stock > 0 ? (
                          <motion.button 
                            className="btn btn-success btn-sm"
                            onClick={() => {
                              addToCart(p, 1);
                              toast.success("Added to cart!");
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaShoppingCart className="me-1" />
                            Add to Cart
                          </motion.button>
                        ) : (
                          <button 
                            className="btn btn-outline-secondary btn-sm" 
                            disabled
                          >
                            {p.stock === 0 ? 'Out of Stock' : 'Login to Buy'}
                          </button>
                        )}
                        
                        <Link to={`/reviews/${p._id}`} className="btn btn-outline-primary btn-sm">
                          <FaEye className="me-1" />
                          Reviews
                        </Link>
                        
                        {canEditOrDelete(p) && (
                          <div className="admin-actions">
                            <Link 
                              to={`/edit-product/${p._id}`} 
                              className="btn btn-outline-warning btn-sm"
                            >
                              <FaEdit />
                            </Link>
                            <motion.button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteProduct(p._id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaTrash />
                            </motion.button>
                          </div>
                        )}
            </div>
          </div>
        </div>
                </motion.div>
      ))}
            </AnimatePresence>
    </div>
        )}
      </motion.div>
    </motion.div>
  );
}
