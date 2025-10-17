// src/pages/FarmerOrders.jsx
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["Pending", "Packed", "Shipped", "Delivered"];

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders/farmer-orders")
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders"));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <h3 className="mb-3">Customer Orders</h3>
      {orders.length === 0 && <p className="text-muted">No orders yet.</p>}
      {orders.map((order) => (
        <div className="card mb-3 shadow-sm" key={order._id}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h6>Order ID: <small className="text-muted">{order._id}</small></h6>
                <p className="mb-1"><b>Customer:</b> {order.customer?.name || order.customer?.email || "—"}</p>
                <p className="mb-1"><b>Total:</b> ₹{order.totalAmount}</p>
              </div>
              <div className="text-end">
                <small className="text-muted">{new Date(order.createdAt).toLocaleString()}</small>
              </div>
            </div>

            <hr />

            <ul className="list-unstyled mb-3">
              {order.products.map((p, i) => (
                <li key={i} className="mb-1">
                  {p.product?.name || "Product"} — {p.quantity} × ₹{p.price}
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center">
              <label className="me-2 mb-0">Status:</label>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="form-select w-auto"
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
