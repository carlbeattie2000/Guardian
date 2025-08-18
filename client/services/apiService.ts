import axios from "axios";

const BASE_URL = "http://localhost:2699";

const apiService = axios.create({
  baseURL: BASE_URL,
});

apiService.interceptors.request.use(function (config) {
  config.headers.set("Authorization", "Bearer");
  config.validateStatus = (status) => status < 500;

  return config;
});

export { apiService };
