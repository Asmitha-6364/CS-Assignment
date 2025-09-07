import axios from "axios";

// Base axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api/files",
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// File APIs
export async function uploadFile(formData) {
  return API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function fetchFileList() {
  return API.get("/list");
}

export async function fetchFileMeta(filename) {
  return API.get(`/download/${encodeURIComponent(filename)}`);
}

// ✅ only keep this for new listing function
export const getFiles = async () => {
  const res = await API.get("/list");
  return res.data;
};
