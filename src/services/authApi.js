import axios from "axios";
import { API_BASE_URL, authHeaders } from "../config/api";

const API_URL = `${API_BASE_URL}/auth`;

export const login = async (user) => {
  const { data } = await axios.post(`${API_URL}/login`, user);
  return data;
};

export const register = async (user) => {
  const { data } = await axios.post(`${API_URL}/register`, user);
  return data;
};

export const getProfile = async () => {
  const { data } = await axios.get(`${API_URL}/profile`, authHeaders());
  return data;
};

// ================= UPDATE PROFILE =================

export const updateProfile = async (user) => {
  const { data } = await axios.put(
    `${API_URL}/profile`,
    user,
    authHeaders()
  );

  return data;
};
