import axios from "axios";
import { API_BASE_URL, authHeaders } from "../../config/api";

const API_URL = `${API_BASE_URL}/categories`;

// ======================
// GET ALL
// ======================

export const getCategories = async () => {
  const { data } = await axios.get(API_URL);

  return data;
};

// ======================
// GET ONE
// ======================

export const getCategoryById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);

  return data;
};

// ======================
// CREATE
// ======================

export const createCategory = async (category) => {
  const { data } = await axios.post(
    API_URL,
    category,
    {
      ...authHeaders(),
      headers: {
        ...authHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// ======================
// UPDATE
// ======================

export const updateCategory = async (
  id,
  category
) => {
  const { data } = await axios.put(
    `${API_URL}/${id}`,
    category,
    {
      ...authHeaders(),
      headers: {
        ...authHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// ======================
// DELETE
// ======================

export const deleteCategory = async (id) => {
  const { data } = await axios.delete(
    `${API_URL}/${id}`,
    authHeaders()
  );

  return data;
};
