import { NavLink } from "react-router-dom";
import {
    Home,
    LayoutGrid,
    Folder,
    CheckSquare,
    Calendar,
    Users,
    MessageSquare,
    Settings,
    HelpCircle,
    ChevronDown,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/initials";
import logo from "../../assets/img/logo_CollabTask.png";

const MENU_ITEMS = [
    { to: "/", label: "Accueil", icon: Home, end: true },
    { to: "/espaces", label: "Espaces de travail", icon: LayoutGrid },
    { to: "/projets", label: "Projets", icon: Folder },
    { to: "/taches", label: "Tâches", icon: CheckSquare },
    { to: "/calendrier", label: "Calendrier", icon: Calendar },
    { to: "/equipe", label: "Équipe", icon: Users },
    { to: "/messages", label: "Messages", icon: MessageSquare },
];

function NavItem({ to, label, icon: Icon, end }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                        ? "bg-brand-blue/15 text-white border-l-2 border-brand-blue -ml-0.5 pl-[11px]"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
            }
        >
            <Icon size={18} />
            {label}
        </NavLink>
    );
}

export default function Sidebar() {
    const { user } = useAuth();
    const fullName = user ? `${user.firstname} ${user.lastname}` : "";
    const initials = user ? getInitials(user.firstname, user.lastname) : "";

    return (
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-brand-navy h-screen sticky top-0">
            <div className="p-4">
                <div className="bg-white rounded-xl p-3 flex items-center justify-center">
                    <img src={logo} alt="CollabTask" className="w-full max-w-[140px]" />
                </div>
            </div>

            <div className="px-4 pb-4">
                <div className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Espace actif
                </div>
                <button className="flex w-full items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10">
                    <span className="flex items-center gap-2 truncate">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-brand-blue" />
                        <span className="truncate">Développement Produit</span>
                    </span>
                    <ChevronDown size={16} className="shrink-0 text-slate-400" />
                </button>
            </div>

            <div className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Menu</div>
            <nav className="flex-1 space-y-1 px-4">
                {MENU_ITEMS.map((item) => (
                    <NavItem key={item.to} {...item} />
                ))}
            </nav>

            <div className="space-y-1 border-t border-white/10 px-4 py-3">
                <NavItem to="/parametres" label="Paramètres" icon={Settings} />
                <NavItem to="/aide" label="Aide" icon={HelpCircle} />
            </div>

            <div className="flex items-center gap-3 border-t border-white/10 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-white">
                    {initials}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{fullName}</p>
                    <p className="truncate text-xs text-slate-400">Cheffe de projet</p>
                </div>
            </div>
        </aside>
    );
}
