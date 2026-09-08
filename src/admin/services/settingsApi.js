import axios from "axios";

import { API_BASE_URL, authHeaders } from "../../config/api";

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
