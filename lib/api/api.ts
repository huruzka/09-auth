import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_NOTEHUB_URL;
if (!baseURL) throw new Error("NEXT_PUBLIC_NOTEHUB_URL is not defined");

const apiClient = axios.create({
    baseURL,
  withCredentials: true // Позволяет отправлять cookie с запросами
});

export default apiClient;
