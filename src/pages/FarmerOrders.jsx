// src/pages/FarmerOrders.jsx
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["Pending", "Packed", "Shipped", "Delivered"];

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders/farmer-orders");
      setOrders(response.data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "badge bg-warning";
      case "confirmed":
        return "badge bg-info";
      case "packed":
        return "badge bg-primary";
      case "shipped":
        return "badge bg-info";
      case "delivered":
        return "badge bg-success";
      case "cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  const getTotalRevenue = () => {
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status.toLowerCase() === status.toLowerCase()).length;
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
        <h2>Customer Orders</h2>
        <button 
          className="btn btn-outline-primary"
          onClick={fetchOrders}
        >
          Refresh
        </button>
      </div>

      {/* Order Statistics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="text-primary">{orders.length}</h5>
              <p className="mb-0">Total Orders</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="text-success">₹{getTotalRevenue().toFixed(2)}</h5>
              <p className="mb-0">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="text-warning">{getOrdersByStatus("pending")}</h5>
              <p className="mb-0">Pending</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="text-info">{getOrdersByStatus("delivered")}</h5>
              <p className="mb-0">Delivered</p>
            </div>
          </div>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">No orders yet</h4>
          <p className="text-muted">Orders from customers will appear here!</p>
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
                        Received on {new Date(order.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="text-end">
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status}
                      </span>
                      <h5 className="mt-2 mb-0">₹{order.totalAmount.toFixed(2)}</h5>
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-primary">Customer Details</h6>
                      <p className="mb-1"><strong>Name:</strong> {order.customer?.name || "—"}</p>
                      <p className="mb-0"><strong>Email:</strong> {order.customer?.email || "—"}</p>
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
                  
                  <div className="mt-3">
                    <div className="d-flex align-items-center">
                      <label className="me-2 mb-0"><strong>Update Status:</strong></label>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="form-select w-auto"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
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
