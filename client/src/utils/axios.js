import axios from "axios";

const uri = import.meta.env.VITE_API_URL;

console.log(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: uri,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
