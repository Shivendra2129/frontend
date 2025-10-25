// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";
import "./Cart.css";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav 
      className={`navbar navbar-expand-lg px-3 ${isScrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="brand-text"
          >
            🌱 Farm Marketplace
          </motion.span>
        </Link>

        <motion.button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </motion.button>

        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <motion.li 
              className="nav-item"
              whileHover={{ scale: 1.05 }}
            >
              <Link className="nav-link" to="/products">Products</Link>
            </motion.li>
            
            {user?.role === "farmer" && (
              <>
                <motion.li 
                  className="nav-item"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link className="nav-link" to="/add-product">Add Product</Link>
                </motion.li>
                <motion.li 
                  className="nav-item"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link className="nav-link" to="/farmer-orders">My Orders</Link>
                </motion.li>
              </>
            )}
            
            {user?.role === "customer" && (
              <motion.li 
                className="nav-item"
                whileHover={{ scale: 1.05 }}
              >
                <Link className="nav-link" to="/orders">My Orders</Link>
              </motion.li>
            )}
            
            {user?.role === "admin" && (
              <motion.li 
                className="nav-item"
                whileHover={{ scale: 1.05 }}
              >
                <Link className="nav-link" to="/admin">Admin Dashboard</Link>
              </motion.li>
            )}
          </ul>

          <ul className="navbar-nav">
            <motion.li 
              className="nav-item me-2"
              whileHover={{ scale: 1.05 }}
            >
              <button 
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
            </motion.li>

            {user && (
              <motion.li 
                className="nav-item me-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button 
                  className="cart-btn position-relative"
                  onClick={() => setIsCartOpen(true)}
                >
                  <FaShoppingCart />
                  {getTotalItems() > 0 && (
                    <motion.span 
                      className="cart-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {getTotalItems()}
                    </motion.span>
                  )}
                </button>
              </motion.li>
            )}
            
            {!user ? (
              <>
                <motion.li 
                  className="nav-item me-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link className="nav-link" to="/login">Login</Link>
                </motion.li>
                <motion.li 
                  className="nav-item"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link className="nav-link" to="/register">Register</Link>
                </motion.li>
              </>
            ) : (
              <>
                <motion.li 
                  className="nav-item nav-link me-2"
                  whileHover={{ scale: 1.05 }}
                >
                  Hello, {user.name}
                </motion.li>
                <motion.li 
                  className="nav-item"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </motion.li>
              </>
            )}
          </ul>
        </div>
      </div>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </motion.nav>
  );
}


