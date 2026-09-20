import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { setOnUnauthorized } from "../services/api";
import * as authService from "../services/authService";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async () => {
        await authService.logout();
        setUser(null);
    }, []);

    // Au montage : tente de restaurer la session via le refresh cookie
    // httpOnly (utilisateur déjà connecté sur ce navigateur).
    useEffect(() => {
        setOnUnauthorized(() => setUser(null));

        (async () => {
            try {
                await authService.refreshSession();
                const me = await authService.fetchCurrentUser();
                setUser(me);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = useCallback(async (credentials) => {
        const loggedInUser = await authService.login(credentials);
        setUser(loggedInUser);
        return loggedInUser;
    }, []);

    const register = useCallback(async (payload) => {
        const newUser = await authService.register(payload);
        setUser(newUser);
        return newUser;
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
