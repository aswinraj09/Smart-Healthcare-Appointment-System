import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Let the app show a global login alert before redirecting
      try {
        window.dispatchEvent(
          new CustomEvent("unauthenticated", {
            detail: { message: "Session expired. Please login." },
          })
        );
      } catch (e) {}

      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;