import { useState, useContext } from "react";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";

export default function Cart({ isOpen, onClose }) {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, getCartByFarmer, clearCart } = useCart();
  const { user, isCustomer } = useContext(AuthContext);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (!isCustomer()) {
      toast.error("Please login as a customer to place orders");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsPlacingOrder(true);
    
    try {
      const cartByFarmer = getCartByFarmer();
      
      // Place separate orders for each farmer
      for (const farmerCart of cartByFarmer) {
        const orderData = {
          farmer: farmerCart.farmer._id,
          products: farmerCart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
          })),
          totalAmount: farmerCart.total
        };

        await API.post("/orders", orderData);
      }

      toast.success("Orders placed successfully!");
      clearCart();
      onClose();
    } catch (error) {
      toast.error("Failed to place order: " + (error.response?.data?.msg || error.message));
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h5>Your Cart ({getTotalItems()} items)</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">Your cart is empty</p>
              <button className="btn btn-primary" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {getCartByFarmer().map((farmerCart, index) => (
                <div key={index} className="farmer-cart mb-3">
                  <h6 className="text-primary">From: {farmerCart.farmer.name}</h6>
                  {farmerCart.items.map((item) => (
                    <div key={item.product._id} className="cart-item">
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.product.imageURL || "/placeholder.png"} 
                          alt={item.product.name}
                          className="cart-item-image"
                        />
                        <div className="flex-grow-1 ms-2">
                          <h6 className="mb-1">{item.product.name}</h6>
                          <p className="text-muted small mb-1">₹{item.product.price} per kg</p>
                          <div className="d-flex align-items-center">
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            >
                              +
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger ms-2"
                              onClick={() => removeFromCart(item.product._id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-end">
                          <strong>₹{(item.product.price * item.quantity).toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="farmer-total text-end">
                    <strong>Subtotal: ₹{farmerCart.total.toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Total: ₹{getTotalPrice().toFixed(2)}</h5>
            </div>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-success"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !isCustomer()}
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </button>
              {!isCustomer() && (
                <small className="text-muted text-center">
                  Please login as a customer to place orders
                </small>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
