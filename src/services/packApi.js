import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/packs`;

export const getPacks = async (params = {}) => {
  const nextParams = { ...params };

  if (Object.prototype.hasOwnProperty.call(params, "includeInactive")) {
    nextParams.includeInactive = params.includeInactive;
  }

  const { data } = await axios.get(API_URL, {
    params: nextParams,
    withCredentials: true,
  });
  return data;
};

export const getPackById = async (id, params = {}) => {
  const nextParams = { ...params };

  if (Object.prototype.hasOwnProperty.call(params, "includeInactive")) {
    nextParams.includeInactive = params.includeInactive;
  }

  const { data } = await axios.get(`${API_URL}/${id}`, {
    params: nextParams,
    withCredentials: true,
  });
  return data;
};

export const createPack = async (payload) => {
  const { data } = await axios.post(API_URL, payload, { withCredentials: true });
  return data;
};

export const updatePack = async (id, payload) => {
  const { data } = await axios.put(`${API_URL}/${id}`, payload, { withCredentials: true });
  return data;
};

export const deletePack = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
  return data;
};
