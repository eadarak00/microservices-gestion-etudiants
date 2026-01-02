import axios from "axios";
import { getAccessToken, clearTokens } from "../services/token.service";

/**
 * Instance Axios centralisée
 * → Toutes les requêtes HTTP passent par ici
 */
const api = axios.create({
  baseURL: "http://localhost:7070/api", // API Gateway
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Intercepteur REQUEST
 * → Ajoute automatiquement le token JWT
 */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Intercepteur RESPONSE
 * → Gestion globale des erreurs (401, 403)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      clearTokens();
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default api;
