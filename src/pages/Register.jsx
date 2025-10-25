import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLeaf, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";
import "./Auth.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "customer", address: "", contact: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    try {
      await API.post("/users/register", formData);
      toast.success("Registration successful! Please login to continue.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Registration failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-elements">
          <motion.div 
            className="floating-leaf leaf-1"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🌾
          </motion.div>
          <motion.div 
            className="floating-leaf leaf-2"
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
          >
            🥕
          </motion.div>
          <motion.div 
            className="floating-leaf leaf-3"
            animate={{ 
              y: [0, -25, 0],
              rotate: [0, 3, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            🍅
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="auth-form-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="auth-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="auth-header">
            <motion.div 
              className="auth-icon"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <FaLeaf />
            </motion.div>
            <h2 className="auth-title">Join Our Community</h2>
            <p className="auth-subtitle">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="row">
              <motion.div 
                className="col-md-6 form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="form-label">
                  <FaUser className="me-2" />
                  Full Name
                </label>
                <input 
                  className="form-control" 
                  name="name" 
                  placeholder="Enter your full name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div 
                className="col-md-6 form-group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="form-label">
                  <FaEnvelope className="me-2" />
                  Email Address
                </label>
                <input 
                  className="form-control" 
                  name="email" 
                  type="email"
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </motion.div>
            </div>

            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="form-label">
                <FaLock className="me-2" />
                Password
              </label>
              <div className="password-input">
                <input 
                  className="form-control" 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Create a strong password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="form-label">Account Type</label>
              <select 
                className="form-select" 
                name="role" 
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Customer - Buy fresh produce</option>
                <option value="farmer">Farmer - Sell your products</option>
              </select>
            </motion.div>

            <div className="row">
              <motion.div 
                className="col-md-6 form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="form-label">
                  <FaMapMarkerAlt className="me-2" />
                  Address
                </label>
                <input 
                  className="form-control" 
                  name="address" 
                  placeholder="Your address" 
                  value={formData.address}
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div 
                className="col-md-6 form-group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="form-label">
                  <FaPhone className="me-2" />
                  Contact Number
                </label>
                <input 
                  className="form-control" 
                  name="contact" 
                  placeholder="Your phone number" 
                  value={formData.contact}
                  onChange={handleChange}
                />
              </motion.div>
            </div>

            <motion.button 
              className="btn btn-success auth-btn"
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {isLoading ? (
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : null}
              {isLoading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          <motion.div 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-center">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
