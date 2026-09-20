import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const getCategories = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/categories`);
  return data;
};
