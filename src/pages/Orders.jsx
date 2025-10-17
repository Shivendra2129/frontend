// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders/my-orders")
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load your orders"));
  }, []);

  return (
    <div>
      <h3 className="mb-3">My Orders</h3>
      {orders.length === 0 && <p className="text-muted">You have not placed any orders yet.</p>}
      {orders.map((order) => (
        <div className="card mb-3 shadow-sm" key={order._id}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h6>Order ID: <small className="text-muted">{order._id}</small></h6>
                <p className="mb-1"><b>Farmer:</b> {order.farmer?.name || "—"}</p>
                <p className="mb-1"><b>Status:</b> <span className="badge bg-info text-dark">{order.status}</span></p>
              </div>
              <div className="text-end">
                <h5>₹{order.totalAmount}</h5>
                <small className="text-muted">{new Date(order.createdAt).toLocaleString()}</small>
              </div>
            </div>

            <hr />

            <ul className="list-unstyled mb-0">
              {order.products.map((p, i) => (
                <li key={i} className="mb-1">
                  <b>{p.product?.name || "Product"}</b> — {p.quantity} × ₹{p.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
