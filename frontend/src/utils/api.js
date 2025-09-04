import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/files';

export async function uploadFile(formData) {
  return axios.post(`${API_BASE}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function fetchFileList() {
  return axios.get(`${API_BASE}/list`);
}

export async function fetchFileMeta(filename) {
  return axios.get(`${API_BASE}/download/${filename}`);
}
