import axios from "axios";

// Базовый URL для всех запросов к нашему внутреннему API
const baseURL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : "/api";

const apiClient = axios.create({
    baseURL,
    withCredentials: true, // Позволяет отправлять cookie с запросами
});

export default apiClient;