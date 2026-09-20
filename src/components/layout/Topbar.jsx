import { useState } from "react";
import { Search, Plus, Bell, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/initials";

export default function Topbar() {
    const { user, logout } = useAuth();
    const initials = user ? getInitials(user.firstname, user.lastname) : "";
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-3">
            <div className="relative max-w-xl flex-1">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="search"
                    placeholder="Rechercher un projet, une tâche, une personne..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                />
            </div>

            <button className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-blue-dark">
                <Plus size={16} />
                Nouveau projet
            </button>

            <button className="shrink-0 rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
                <Bell size={18} />
            </button>

            <div className="relative shrink-0">
                <button onClick={() => setMenuOpen((open) => !open)} className="flex items-center gap-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-xs font-semibold text-white">
                        {initials}
                    </div>
                    <ChevronDown size={14} className="text-gray-400" />
                </button>

                {menuOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                        <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                            <div className="border-b border-gray-100 px-3 py-2">
                                <p className="truncate text-sm font-medium text-gray-900">
                                    {user?.firstname} {user?.lastname}
                                </p>
                                <p className="truncate text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            >
                                Se déconnecter
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
