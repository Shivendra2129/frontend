// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";
import "./Cart.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand fw-bold" to="/">Farm Marketplace</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
          {user?.role === "farmer" && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/add-product">Add Product</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/farmer-orders">My Orders</Link></li>
            </>
          )}
          {user?.role === "customer" && (
            <li className="nav-item"><Link className="nav-link" to="/orders">My Orders</Link></li>
          )}
          {user?.role === "admin" && (
            <li className="nav-item"><Link className="nav-link" to="/admin">Admin Dashboard</Link></li>
          )}
        </ul>

        <ul className="navbar-nav">
          {user && (
            <li className="nav-item">
              <button 
                className="btn btn-outline-primary position-relative"
                onClick={() => setIsCartOpen(true)}
              >
                🛒 Cart
                {getTotalItems() > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </li>
          )}
          
          {!user ? (
            <>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
            </>
          ) : (
            <>
              <li className="nav-item nav-link">Hello, {user.name}</li>
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
}


