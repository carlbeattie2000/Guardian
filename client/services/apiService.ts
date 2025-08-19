import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://localhost:2699";
const USE_COOKIES = true;

const apiService = axios.create({
  baseURL: BASE_URL,
});

apiService.interceptors.request.use(async function (config) {
  try {
    const token = await SecureStore.getItemAsync("accessToken");

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  } catch (err) {
    console.error(err);
  }

  config.withCredentials = USE_COOKIES;
  config.validateStatus = (status) => status < 500;
  return config;
});

export { apiService };
