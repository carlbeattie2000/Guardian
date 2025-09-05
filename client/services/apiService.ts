import axios from "axios";
import * as SecureStore from "expo-secure-store";

let BASE_URL = "http://192.168.0.238:2699";
const USE_COOKIES = true;

const apiService = axios.create();

//SecureStore.deleteItemAsync("baseURL");

apiService.interceptors.request.use(async function (config) {
	config.baseURL = BASE_URL;

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

const getBaseUrl = async () => {
	try {
		BASE_URL =
			(await SecureStore.getItemAsync("baseURL")) ||
			"http://192.168.0.238:2699";
	} catch (e) {
		console.error(e);
	}
};

const updateBaseUrl = async (url: string) => {
	try {
		await SecureStore.setItemAsync("baseURL", url);
		BASE_URL = url;
	} catch (e) {
		console.error(e);
	}
};

const isBaseURLSet = async () => {
	try {
		const baseURL = await SecureStore.getItemAsync("baseURL");

		return baseURL !== null;
	} catch (e) {
		console.error(e);
		return false;
	}
};

const isBaseURLSetSync = () => {
	try {
		const baseURL = SecureStore.getItem("baseURL");

		return baseURL !== null;
	} catch (e) {
		console.error(e);
		return false;
	}
};

getBaseUrl();

export { apiService, BASE_URL, updateBaseUrl, isBaseURLSet, isBaseURLSetSync };
