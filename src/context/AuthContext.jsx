import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (data) => {
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const isFarmer = () => {
    return user?.role === "farmer";
  };

  const isCustomer = () => {
    return user?.role === "customer";
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isFarmer, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
};
