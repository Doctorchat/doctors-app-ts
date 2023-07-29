import axios from "axios";

import {
  API_SUFFIX,
  API_URL,
  REQUEST_HEADER_AUTH_KEY,
  SESSION_TOKEN_KEY,
  SESSION_USER_KEY,
  TOKEN_TYPE,
} from "@/config";

const axiosInstance = axios.create({
  timeout: 60000,
  baseURL: API_URL + API_SUFFIX,
});

axiosInstance.interceptors.request.use(
  (config) => {
    let accessToken = localStorage.getItem(SESSION_TOKEN_KEY);

    try {
      accessToken = JSON.parse(accessToken || "");
    } catch (error) {
      accessToken = "";
    }

    if (accessToken) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE} ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && [401].includes(response.status)) {
      localStorage.removeItem(SESSION_TOKEN_KEY);
      localStorage.removeItem(SESSION_USER_KEY);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
