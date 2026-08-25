import axios from "axios";
import { API_BASE_URL, authHeaders } from "../../config/api";

const API_URL = `${API_BASE_URL}/dashboard`;

export const getDashboardStats = async () => {
  const { data } = await axios.get(API_URL, authHeaders());

  return data;
};
