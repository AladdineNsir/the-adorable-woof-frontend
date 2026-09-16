import axios from "axios";

import { API_BASE_URL, authHeaders } from "../config/api";

export const getSiteSettings = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/settings`);
  return data;
};

export const updateSiteSettings = async (settings) => {
  const { data } = await axios.put(
    `${API_BASE_URL}/settings`,
    settings,
    authHeaders()
  );
  return data;
};

export const uploadSettingsImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await axios.post(
    `${API_BASE_URL}/settings/image`,
    formData,
    authHeaders()
  );

  return data.imageUrl;
};
