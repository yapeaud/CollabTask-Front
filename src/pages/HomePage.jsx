import { useState } from "react";
import { CheckSquare, Folder, Users, TrendingUp, Plus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { formatLongDate, formatShortDate } from "../utils/formatDate";

const TODAY = new Date(2026, 8, 10);

const STATS = [
    { icon: CheckSquare, iconBg: "bg-blue-50", iconColor: "text-brand-blue", value: "2/5", label: "Tâches terminées aujourd'hui" },
    { icon: Folder, iconBg: "bg-orange-50", iconColor: "text-brand-orange", value: "5", label: "Projets actifs" },
    { icon: Users, iconBg: "bg-green-50", iconColor: "text-brand-green", value: "45", label: "Membres d'équipe" },
    { icon: TrendingUp, iconBg: "bg-purple-50", iconColor: "text-purple-500", value: "43%", label: "Avancement moyen" },
];

const WORKSPACES = [
    { id: "marketing", name: "Marketing", initial: "M", color: "bg-brand-orange", members: 12, projects: 4 },
    { id: "dev", name: "Développement Produit", initial: "D", color: "bg-brand-blue", members: 18, projects: 7, active: true },
    { id: "design", name: "Design", initial: "D", color: "bg-purple-500", members: 6, projects: 3 },
    { id: "support", name: "Support Client", initial: "S", color: "bg-brand-green", members: 9, projects: 2 },
];

const STATUS = {
    en_cours: { label: "En cours", badge: "bg-blue-50 text-brand-blue-dark", bar: "bg-brand-blue", dot: "bg-brand-blue" },
    a_faire: { label: "À faire", badge: "bg-orange-50 text-brand-orange", bar: "bg-brand-orange", dot: "bg-brand-orange" },
    termine: { label: "Terminé", badge: "bg-green-50 text-green-700", bar: "bg-brand-green", dot: "bg-brand-green" },
    en_retard: { label: "En retard", badge: "bg-red-50 text-red-600", bar: "bg-red-500", dot: "bg-red-500" },
};

const FILTERS = [
    { key: "tous", label: "Tous" },
    { key: "en_cours", label: "En cours" },
    { key: "termine", label: "Terminé" },
    { key: "en_retard", label: "En retard" },
];

const PROJECTS = [
    { id: 1, name: "Refonte du site vitrine", category: "Marketing", progress: 68, status: "en_cours", due: new Date(2026, 9, 12), avatars: ["AE", "ML"], extra: 2 },
    { id: 2, name: "Campagne réseaux sociaux", category: "Marketing", progress: 12, status: "a_faire", due: new Date(2026, 9, 20), avatars: ["CL", "JD"], extra: 0 },
    { id: 3, name: "App mobile v2", category: "Développement Produit", progress: 45, status: "en_cours", due: new Date(2026, 10, 5), avatars: ["ML", "SK"], extra: 1 },
    { id: 4, name: "Design system", category: "Design", progress: 100, status: "termine", due: new Date(2026, 8, 28), avatars: ["AE", "TN"], extra: 0 },
    { id: 5, name: "Migration API paiement", category: "Développement Produit", progress: 30, status: "en_retard", due: new Date(2026, 9, 2), avatars: ["SK", "RE"], extra: 1 },
];

const INITIAL_TASKS = [
    { id: 1, label: "Valider les maquettes de la page d'accueil", done: false, priority: "high" },
    { id: 2, label: "Répondre aux commentaires de Marc", done: true, priority: "normal" },
    { id: 3, label: "Préparer la réunion d'équipe de 14h", done: false, priority: "normal" },
    { id: 4, label: "Relire le brief campagne Q4", done: false, priority: "normal" },
    { id: 5, label: "Exporter le rapport d'avancement", done: true, priority: "normal" },
];

const ACTIVITY = [
    { id: 1, initials: "AE", name: "Aïcha Ediba", action: "a terminé la tâche", target: "Maquettes page d'accueil", time: "Il y a 12 min" },
    { id: 2, initials: "ML", name: "Marc Lefèvre", action: "a commenté sur", target: "App mobile v2", time: "Il y a 34 min" },
    { id: 3, initials: "SK", name: "Sofia Kouassi", action: "a rejoint l'espace", target: "Développement Produit", time: "Il y a 1 h" },
];

function StatCard({ icon: Icon, iconBg, iconColor, value, label }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon size={18} className={iconColor} />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    );
}

function WorkspaceCard({ workspace }) {
    return (
        <button
            className={`rounded-xl border bg-white p-4 text-left transition-colors ${
                workspace.active ? "border-brand-blue ring-1 ring-brand-blue" : "border-gray-200 hover:border-gray-300"
            }`}
        >
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold text-white ${workspace.color}`}>
                {workspace.initial}
            </div>
            <p className="truncate text-sm font-medium text-gray-900">{workspace.name}</p>
            <p className="truncate text-xs text-gray-500">
                {workspace.members} membres · {workspace.projects} projets
            </p>
        </button>
    );
}

function AvatarStack({ initials, extra }) {
    return (
        <div className="flex shrink-0 items-center">
            {initials.map((initial, idx) => (
                <div
                    key={initial + idx}
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-[10px] font-semibold text-slate-700 ${
                        idx > 0 ? "-ml-2" : ""
                    }`}
                >
                    {initial}
                </div>
            ))}
            {extra > 0 && (
                <div className="-ml-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-semibold text-slate-500">
                    +{extra}
                </div>
            )}
        </div>
    );
}

function ProjectRow({ project }) {
    const status = STATUS[project.status];
    return (
        <div className="flex items-center gap-4 py-3">
            <span className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`} />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{project.name}</p>
                <p className="truncate text-xs text-gray-500">{project.category}</p>
            </div>
            <div className="hidden w-32 shrink-0 items-center gap-2 sm:flex">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${status.bar}`} style={{ width: `${project.progress}%` }} />
                </div>
                <span className="w-9 shrink-0 text-right text-xs font-medium text-gray-600">{project.progress}%</span>
            </div>
            <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium md:inline-block ${status.badge}`}>
                {status.label}
            </span>
            <span className="hidden w-14 shrink-0 text-xs text-gray-500 lg:inline-block">{formatShortDate(project.due)}</span>
            <AvatarStack initials={project.avatars} extra={project.extra} />
        </div>
    );
}

export default function HomePage() {
    const { user } = useAuth();
    const [filter, setFilter] = useState("tous");
    const [tasks, setTasks] = useState(INITIAL_TASKS);

    const filteredProjects = filter === "tous" ? PROJECTS : PROJECTS.filter((p) => p.status === filter);
    const doneCount = tasks.filter((t) => t.done).length;

    function toggleTask(id) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Bonjour, {user?.firstname}</h1>
                    <p className="text-sm text-gray-500">Voici un aperçu de votre activité — {formatLongDate(TODAY)}.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                    Espace actif : Développement Produit
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {STATS.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900">Mes espaces de travail</h2>
                    <button className="text-xs font-medium text-brand-blue-dark hover:underline">Voir tout</button>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                    {WORKSPACES.map((workspace) => (
                        <WorkspaceCard key={workspace.id} workspace={workspace} />
                    ))}
                    <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 p-4 text-gray-400 hover:border-gray-400 hover:text-gray-500">
                        <Plus size={20} />
                        <span className="text-sm font-medium">Créer un espace</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4 xl:col-span-2">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold text-gray-900">Projets récents</h2>
                        <div className="flex items-center gap-4">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => setFilter(f.key)}
                                    className={
                                        filter === f.key
                                            ? "rounded-md bg-brand-blue px-3 py-1 text-xs font-semibold text-white"
                                            : "text-xs font-medium text-gray-500 hover:text-gray-700"
                                    }
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {filteredProjects.map((project) => (
                            <ProjectRow key={project.id} project={project} />
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Tâches du jour</h2>
                            <span className="text-xs font-medium text-gray-400">
                                {doneCount}/{tasks.length}
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {tasks.map((task) => (
                                <label key={task.id} className="flex cursor-pointer items-center gap-3 py-2">
                                    <input
                                        type="checkbox"
                                        checked={task.done}
                                        onChange={() => toggleTask(task.id)}
                                        className="h-4 w-4 shrink-0 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                                    />
                                    {!task.done && (
                                        <span
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                                task.priority === "high" ? "bg-red-500" : "bg-gray-300"
                                            }`}
                                        />
                                    )}
                                    <span className={`text-sm ${task.done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                                        {task.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Activité de l'équipe</h2>
                            <button className="text-xs font-medium text-brand-blue-dark hover:underline">Voir tout</button>
                        </div>
                        <ul className="space-y-3">
                            {ACTIVITY.map((activity) => (
                                <li key={activity.id} className="flex items-start gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
                                        {activity.initials}
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        <span className="font-medium text-gray-900">{activity.name}</span> {activity.action}{" "}
                                        <span className="font-medium text-gray-900">{activity.target}</span>
                                        <br />
                                        <span className="text-gray-400">{activity.time}</span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
