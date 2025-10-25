// src/pages/Home.jsx
import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaLeaf, FaTruck, FaHeart, FaStar, FaSync } from "react-icons/fa";
import API from "../api/axiosConfig";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "./Home.css";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProducts, setShowProducts] = useState(false);
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();


  // useEffect(() => {
  //   fetchFeaturedProducts();
  // }, []);
  useEffect(() => {
  fetchFeaturedProducts().then(() => setShowProducts(true));}, []);

  const fetchFeaturedProducts = async () => {
    try {
      setIsLoading(true);
      const response = await API.get("/products");
      const allProducts = response.data;
      console.log(response.data);
      
      // Shuffle array and take 6 random products
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      setFeatured(shuffled.slice(0, 6));
      
      // Trigger animation after a short delay
      setTimeout(() => {
        setShowProducts(true);
      }, 100);
      
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load featured products");
    } finally {
      setIsLoading(false);
      
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hero-text"
          >
            <h1 className="hero-title">
              Fresh produce directly from 
              <span className="highlight"> farmers</span>
            </h1>
            <p className="hero-subtitle">
              Organic, local, and affordable — delivered with trust. 
              Connect with local farmers and enjoy the freshest produce.
            </p>
            <div className="hero-buttons">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/products" className="btn btn-primary btn-lg me-3">
                  <FaShoppingCart className="me-2" />
                  Shop Now
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register" className="btn btn-outline-primary btn-lg">
                  Join Community
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hero-image"
          >
            <div className="floating-icons">
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="floating-icon icon-1"
              >
                🥬
              </motion.div>
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="floating-icon icon-2"
              >
                🍅
              </motion.div>
              <motion.div
                animate={{ 
                  x: [-80, -80, -80],
                  y: [0, -30, 0],
                  rotate: [0, 3, 0]
                }}
                transition={{ 
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="floating-icon icon-3"
              >
                🥕
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <motion.h2 
            className="section-title text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Why Choose Our Marketplace?
          </motion.h2>
          
          <motion.div 
            className="row"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="col-md-4 mb-4" variants={itemVariants}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaLeaf />
                </div>
                <h4>Fresh & Organic</h4>
                <p>Directly sourced from local farmers, ensuring the freshest and most organic produce.</p>
              </div>
            </motion.div>
            
            <motion.div className="col-md-4 mb-4" variants={itemVariants}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaTruck />
                </div>
                <h4>Fast Delivery</h4>
                <p>Quick and reliable delivery service to bring fresh produce to your doorstep.</p>
              </div>
            </motion.div>
            
            <motion.div className="col-md-4 mb-4" variants={itemVariants}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaHeart />
                </div>
                <h4>Support Local</h4>
                <p>Support local farmers and contribute to sustainable agriculture in your community.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section 
        className="products-section featured-products"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <motion.div 
            className="d-flex justify-content-between align-items-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-0">Featured Produce</h2>
            <motion.button
              className="btn btn-outline-primary"
              onClick={() => {
                setShowProducts(false);
                fetchFeaturedProducts();
              }}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSync className={`me-2 ${isLoading ? 'spinning' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </motion.button>
          </motion.div>
          
          {isLoading ? (
            <motion.div 
              className="text-center py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted">Loading products...</p>
            </motion.div>
          ) : featured.length === 0 ? (
            <motion.div 
              className="text-center py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted">No products to show yet.</p>
            </motion.div>
          ) : (
            <motion.div 
              className="row"
              variants={containerVariants}
              initial="visible"
              animate="visible"
              viewport={{ once: true }}
            >
              {featured.map((p, index) => (
                <motion.div 
                  className="col-md-4 mb-4" 
                  key={p._id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="product-card">
                    <div className="product-image">
                      <img
                        src={p.imageURL || "/placeholder.png"}
                        alt={p.name}
                      />
                      <div className="product-overlay">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            addToCart(p, 1);
                            toast.success("Added to cart!");
                          }}
                          disabled={!user || p.stock === 0}
                        >
                          <FaShoppingCart />
                        </motion.button>
                      </div>
                      <div className="product-badges">
                        <span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span className="badge bg-info">{p.category}</span>
                      </div>
                    </div>
                    <div className="product-content">
                      <h5 className="product-title">{p.name}</h5>
                      <p className="product-description">{p.description || "Fresh, organic produce from local farmers."}</p>
                      
                      <div className="product-meta">
                        <div className="price-section">
                          <span className="price">₹{p.price}</span>
                          <span className="unit">/ kg</span>
                        </div>
                        <div className="farmer-info">
                          <small className="text-muted">
                            <FaLeaf className="me-1" />
                            By {p.farmer?.name || 'Local Farmer'}
                          </small>
                        </div>
                      </div>
                      
                      <div className="product-stats">
                        <div className="stock-info">
                          <span className="stock-label">Available:</span>
                          <span className="stock-value">{p.stock} kg</span>
                        </div>
                        <div className="rating-info">
                          <FaStar className="text-warning me-1" />
                          <span className="rating-text">Fresh & Organic</span>
                        </div>
                      </div>
                      
                      <div className="product-actions">
                        <Link to={`/reviews/${p._id}`} className="btn btn-outline-primary btn-sm">
                          <FaStar className="me-1" />
                          Reviews
                        </Link>
                        {user && p.stock > 0 && (
                          <motion.button 
                            className="btn btn-success btn-sm"
                            onClick={() => {
                              addToCart(p, 1);
                              toast.success("Added to cart!");
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Add to Cart
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
