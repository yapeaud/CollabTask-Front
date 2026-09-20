import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login(form);
            navigate(ROUTES.HOME);
        } catch (err) {
            setError(err.response?.data?.message || "Impossible de se connecter");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
            <h1 className="text-2xl font-semibold text-brand-navy">Connexion</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-sm text-red-600">{error}</p>}

                <input
                    type="email"
                    required
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                />
                <input
                    type="password"
                    required
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-navy text-white rounded-md py-2 text-sm font-medium hover:bg-brand-navy-dark transition-colors disabled:opacity-50"
                >
                    {submitting ? "Connexion..." : "Se connecter"}
                </button>
            </form>

            <p className="text-sm text-gray-500 text-center">
                Pas encore de compte ?{" "}
                <Link to={ROUTES.REGISTER} className="text-brand-blue-dark font-medium hover:underline">
                    Créer un compte
                </Link>
            </p>
        </div>
    );
}