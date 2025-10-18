// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders/my-orders");
      setOrders(response.data);
    } catch (error) {
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "badge bg-warning";
      case "confirmed":
        return "badge bg-info";
      case "shipped":
        return "badge bg-primary";
      case "delivered":
        return "badge bg-success";
      case "cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Orders</h2>
        <button 
          className="btn btn-outline-primary"
          onClick={fetchOrders}
        >
          Refresh
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">No orders yet</h4>
          <p className="text-muted">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-12 mb-4" key={order._id}>
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Order #{order._id.slice(-8).toUpperCase()}</h6>
                      <small className="text-muted">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="text-end">
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <h5 className="mt-2 mb-0">₹{order.totalAmount.toFixed(2)}</h5>
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-primary">Farmer Details</h6>
                      <p className="mb-1"><strong>Name:</strong> {order.farmer?.name || "—"}</p>
                      <p className="mb-0"><strong>Contact:</strong> {order.farmer?.email || "—"}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-primary">Order Summary</h6>
                      <p className="mb-1"><strong>Items:</strong> {order.products.length}</p>
                      <p className="mb-0"><strong>Total Quantity:</strong> {order.products.reduce((sum, p) => sum + p.quantity, 0)}</p>
                    </div>
                  </div>
                  
                  <hr />
                  
                  <h6 className="text-primary mb-3">Products Ordered</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.products.map((p, i) => (
                          <tr key={i}>
                            <td>
                              <strong>{p.product?.name || "Product"}</strong>
                            </td>
                            <td>{p.quantity}</td>
                            <td>₹{p.price.toFixed(2)}</td>
                            <td><strong>₹{(p.quantity * p.price).toFixed(2)}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
