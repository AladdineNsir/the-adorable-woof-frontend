import axios from "axios";
import { API_BASE_URL, authHeaders } from "../../config/api";

const API_URL =
  `${API_BASE_URL}/subcategories`;

// ======================
// GET ALL
// ======================

export const getSubCategories =
  async () => {
    const { data } = await axios.get(
      API_URL
    );

    return data;
  };

// ======================
// GET BY ID
// ======================

export const getSubCategoryById =
  async (id) => {
    const { data } = await axios.get(
      `${API_URL}/${id}`
    );

    return data;
  };

// ======================
// GET BY CATEGORY
// ======================

export const getSubCategoriesByCategory =
  async (categoryId) => {
    const { data } = await axios.get(
      `${API_URL}/category/${categoryId}`
    );

    return data;
  };

// ======================
// CREATE
// ======================

export const createSubCategory =
  async (subCategory) => {
    const { data } = await axios.post(
      API_URL,
      subCategory,
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

export const updateSubCategory =
  async (id, subCategory) => {
    const { data } = await axios.put(
      `${API_URL}/${id}`,
      subCategory,
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

export const deleteSubCategory =
  async (id) => {
    const { data } = await axios.delete(
      `${API_URL}/${id}`,
      authHeaders()
    );

    return data;
  };
