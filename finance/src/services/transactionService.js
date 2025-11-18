// src/services/transactionService.js
import api from "../api/axios";

// Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No Firebase token found");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Create a new transaction
export const createTransaction = async (data) => {
  try {
    const res = await api.post("transactions/", data, getAuthHeaders());
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Fetch user’s transactions
export const fetchTransactions = async () => {
  try {
    const res = await api.get("transactions/", getAuthHeaders());
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
