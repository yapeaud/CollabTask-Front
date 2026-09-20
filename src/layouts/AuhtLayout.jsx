import { Outlet } from "react-router-dom";
import logo from "../assets/img/logo_CollabTask.png";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md">
                <img src={logo} alt="CollabTask" className="w-56 mx-auto mb-8" />
                <Outlet />
            </div>
        </div>
    );
}
