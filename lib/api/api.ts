import axios from "axios";

// 🔹 Створюємо axios-інстанс
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NOTEHUB_URL,
  withCredentials: true, // 👈 обов’язково для передачі cookie
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔹 Перехоплювачі для логів (опціонально, щоб бачити помилки)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response || error.message);
    throw error;
  }
);

export default apiClient;