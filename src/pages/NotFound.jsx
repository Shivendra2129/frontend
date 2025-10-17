// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center mt-5">
      <h1>404</h1>
      <p className="lead">Page not found</p>
      <Link className="btn btn-primary" to="/">Return to home</Link>
    </div>
  );
}
