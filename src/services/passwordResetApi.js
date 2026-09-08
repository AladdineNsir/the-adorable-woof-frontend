import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const requestPasswordReset = async (email) => {
  const { data } = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await axios.post(`${API_BASE_URL}/auth/reset-password/${token}`, { password });
  return data;
};
