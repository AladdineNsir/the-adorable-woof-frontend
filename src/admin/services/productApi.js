import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const API_URL = `${API_BASE_URL}/products`;

// ==========================
// GET ALL PRODUCTS
// ==========================
export const getProducts = async (params = {}) => {
  const { data } = await axios.get(API_URL, { params });

  return data;
};

// ==========================
// GET PRODUCT BY ID
// ==========================
export const getProductById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);

  return data;
};

// ==========================
// CREATE PRODUCT
// ==========================
export const createProduct = async (formData) => {
  const { data } = await axios.post(API_URL, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// ==========================
// UPDATE PRODUCT
// ==========================
export const updateProduct = async (id, formData) => {
  const { data } = await axios.put(
    `${API_URL}/${id}`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// ==========================
// DELETE PRODUCT
// ==========================
export const deleteProduct = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });

  return data;
};
