// axios.js
import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
  baseURL: "https://finance-backend-2jsm.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
