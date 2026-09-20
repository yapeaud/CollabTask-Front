import api, { setAccessToken } from "./api";

export async function register({ email, password, firstname, lastname }) {
    const { data } = await api.post("/auth/register", { email, password, firstname, lastname });
    setAccessToken(data.accessToken);
    return data.user;
}

export async function login({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    return data.user;
}

export async function logout() {
    await api.post("/auth/logout").catch(() => {});
    setAccessToken(null);
}

export async function fetchCurrentUser() {
    const { data } = await api.get("/auth/me");
    return data.user;
}

// Au chargement de l'app, on tente de restaurer la session via le cookie
// refresh (httpOnly) sans forcer l'utilisateur à se reconnecter.
export async function refreshSession() {
    const { data } = await api.post("/auth/refresh");
    setAccessToken(data.accessToken);
    return data.accessToken;
}
