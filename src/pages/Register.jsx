import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "customer", address: "", contact: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/register", formData);
      alert("Registration successful!");
      navigate("/login");
    } catch {
      alert("Failed to register!");
    }
  };

  return (
    <div className="mt-5 mx-auto" style={{ maxWidth: 400 }}>
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="name" placeholder="Name" onChange={handleChange} />
        <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} />
        <input className="form-control mb-2" type="password" name="password" placeholder="Password" onChange={handleChange} />
        <select className="form-select mb-2" name="role" onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="farmer">Farmer</option>
        </select>
        <input className="form-control mb-2" name="address" placeholder="Address" onChange={handleChange} />
        <input className="form-control mb-2" name="contact" placeholder="Contact" onChange={handleChange} />
        <button className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
}
