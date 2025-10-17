import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import API from "../api/axiosConfig";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get("/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Error fetching users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await API.put(`/users/${userId}/role`, { role: newRole });
      toast.success(response.data.msg);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Error updating user role: " + error.message);
    }
  };

  const promoteToAdmin = async (userId) => {
    try {
      const response = await API.put(`/users/${userId}/promote-admin`);
      toast.success(response.data.msg);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Error promoting user: " + error.message);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const response = await API.delete(`/users/${userId}`);
      toast.success(response.data.msg);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Error deleting user: " + error.message);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "badge bg-danger";
      case "farmer":
        return "badge bg-success";
      case "customer":
        return "badge bg-primary";
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Admin Dashboard - User Management</h2>
          
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">All Users ({users.length})</h5>
            </div>
            <div className="card-body">
              {users.length === 0 ? (
                <p className="text-muted">No users found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Address</th>
                        <th>Contact</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userData) => (
                        <tr key={userData._id}>
                          <td>
                            <strong>{userData.name}</strong>
                            {userData._id === user._id && (
                              <span className="badge bg-info ms-2">You</span>
                            )}
                          </td>
                          <td>{userData.email}</td>
                          <td>
                            <span className={getRoleBadgeClass(userData.role)}>
                              {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                            </span>
                          </td>
                          <td>{userData.address || "N/A"}</td>
                          <td>{userData.contact || "N/A"}</td>
                          <td>{new Date(userData.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="btn-group" role="group">
                              {/* Role Change Dropdown */}
                              <div className="dropdown">
                                <button
                                  className="btn btn-outline-primary btn-sm dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  disabled={userData._id === user._id}
                                >
                                  Change Role
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => updateUserRole(userData._id, "customer")}
                                      disabled={userData.role === "customer"}
                                    >
                                      Make Customer
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => updateUserRole(userData._id, "farmer")}
                                      disabled={userData.role === "farmer"}
                                    >
                                      Make Farmer
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => promoteToAdmin(userData._id)}
                                      disabled={userData.role === "admin"}
                                    >
                                      Make Admin
                                    </button>
                                  </li>
                                </ul>
                              </div>
                              
                              {/* Delete Button */}
                              <button
                                className="btn btn-outline-danger btn-sm ms-1"
                                onClick={() => deleteUser(userData._id)}
                                disabled={userData._id === user._id}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h5>Quick Actions</h5>
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Total Users</h6>
                    <h3 className="text-primary">{users.length}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Admins</h6>
                    <h3 className="text-danger">{users.filter(u => u.role === "admin").length}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Farmers</h6>
                    <h3 className="text-success">{users.filter(u => u.role === "farmer").length}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
