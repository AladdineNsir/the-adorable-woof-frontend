import axios from "axios";
import { API_BASE_URL, authHeaders } from "../config/api";

const API_URL = `${API_BASE_URL}/orders`;

// =======================
// CREATE ORDER
// =======================

export const createOrder = async (order) => {
  const { data } = await axios.post(
    API_URL,
    order,
    authHeaders()
  );

  return data;
};

// =======================
// MY ORDERS
// =======================

export const getMyOrders = async () => {
  const { data } = await axios.get(
    `${API_URL}/mine`,
    authHeaders()
  );

  return data;
};

// =======================
// ORDER DETAILS
// =======================

export const getOrderById = async (id) => {
  const { data } = await axios.get(
    `${API_URL}/${id}`,
    authHeaders()
  );

  return data;
};

// =======================
// ADMIN
// =======================

export const getOrders = async (params = {}) => {
  const { data } = await axios.get(
    API_URL,
    {
      ...authHeaders(),
      params,
    }
  );

  return data;
};

// =======================
// UPDATE STATUS
// =======================

export const updatePhoneStatus = async (id, status) => {
  const { data } = await axios.put(
    `${API_URL}/${id}/phone`,
    { status },
    authHeaders()
  );

  return data;
};

export const updateDeliveryStatus = async (id, status) => {
  const { data } = await axios.put(
    `${API_URL}/${id}/delivery`,
    { status },
    authHeaders()
  );

  return data;
};

export const updateOrderStatus = updateDeliveryStatus;
