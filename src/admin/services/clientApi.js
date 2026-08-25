import axios from "axios";
import { API_BASE_URL, authHeaders } from "../../config/api";

const API_URL = `${API_BASE_URL}/users`;

export const getClients = async (params = {}) => {
  const { data } = await axios.get(API_URL, {
    ...authHeaders(),
    params,
  });
  return data;
};

export const getClientById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`, authHeaders());
  return data;
};
