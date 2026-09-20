import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "", firstname: "", lastname: "" });
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    function update(field) {
        return (e) => setForm({ ...form, [field]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await register(form);
            navigate(ROUTES.HOME);
        } catch (err) {
            setError(err.response?.data?.message || "Impossible de créer le compte");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
            <h1 className="text-2xl font-semibold text-brand-navy">Créer un compte</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex gap-3">
                    <input
                        required
                        placeholder="Prénom"
                        value={form.firstname}
                        onChange={update("firstname")}
                        className="w-1/2 border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    />
                    <input
                        required
                        placeholder="Nom"
                        value={form.lastname}
                        onChange={update("lastname")}
                        className="w-1/2 border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    />
                </div>
                <input
                    type="email"
                    required
                    placeholder="Email"
                    value={form.email}
                    onChange={update("email")}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                />
                <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={update("password")}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-navy text-white rounded-md py-2 text-sm font-medium hover:bg-brand-navy-dark transition-colors disabled:opacity-50"
                >
                    {submitting ? "Création..." : "Créer mon compte"}
                </button>
            </form>

            <p className="text-sm text-gray-500 text-center">
                Déjà un compte ?{" "}
                <Link to={ROUTES.LOGIN} className="text-brand-blue-dark font-medium hover:underline">
                    Se connecter
                </Link>
            </p>
        </div>
    );
}