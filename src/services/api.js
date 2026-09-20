import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: `${API_URL}/api`,
    // Nécessaire pour que le cookie httpOnly du refresh token soit envoyé/reçu.
    withCredentials: true,
});

let accessToken = null;
let onUnauthorized = null;

export function setAccessToken(token) {
    accessToken = token;
}

// Enregistre un callback appelé quand le refresh échoue (session expirée) —
// AuthContext s'en sert pour déconnecter l'utilisateur côté état React.
export function setOnUnauthorized(callback) {
    onUnauthorized = callback;
}

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

let refreshPromise = null;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        if (response?.status !== 401 || config._retried || config.url?.includes("/auth/refresh")) {
            throw error;
        }
        config._retried = true;

        try {
            // Plusieurs requêtes peuvent échouer en même temps : on mutualise
            // l'appel de refresh pour n'en déclencher qu'un seul.
            refreshPromise ??= api.post("/auth/refresh").finally(() => {
                refreshPromise = null;
            });

            const { data } = await refreshPromise;
            setAccessToken(data.accessToken);
            config.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(config);
        } catch (refreshError) {
            setAccessToken(null);
            onUnauthorized?.();
            throw refreshError;
        }
    }
);

export default api;
