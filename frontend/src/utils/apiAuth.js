import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// Login
export const loginUser = async (email, password) => {
  const { data } = await API.post("/login", { email, password });
  return data; // expects { token }
};

// Signup
export const signupUser = async (email, password) => {
  const { data } = await API.post("/register", { email, password });
  return data; // can return success message
};

// Verify token
export const verifyUser = async (token) => {
  const { data } = await API.get("/verify", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data; // { valid: true, email }
};