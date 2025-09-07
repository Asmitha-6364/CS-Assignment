import React, { createContext, useState, useEffect, useContext } from "react";
import { loginUser, signupUser } from "../utils/apiAuth";
import axios from "axios";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify token with backend
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setToken(storedToken);
        setUser({ id: res.data.id, email: res.data.email });
      } catch {
        // Invalid/expired token → clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data?.token) {
      setToken(data.token);
      setUser({ email });
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);
    } else {
      throw new Error("Login failed: No token received");
    }
  };

  const signup = async (email, password) => {
    await signupUser(email, password);
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
