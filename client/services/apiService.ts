import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://192.168.0.238:2699";
const USE_COOKIES = true;

const apiService = axios.create({
  baseURL: BASE_URL,
});

apiService.interceptors.request.use(async function (config) {
  try {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    if (refreshToken) {
      config.headers.set("Refresh-Token", refreshToken);
    }
  } catch (err) {
    console.error(err);
  }

  config.withCredentials = USE_COOKIES;
  config.validateStatus = (status) => status < 500;
  return config;
});

export { apiService, BASE_URL };
