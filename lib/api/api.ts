import axios from "axios";

// 🔹 Створюємо axios-інстанс
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NOTEHUB_URL,
  withCredentials: true, //  для передачі cookie
});


export default apiClient;