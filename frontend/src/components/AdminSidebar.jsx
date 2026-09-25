import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  CalendarDays,
} from "lucide-react";

const links = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Services", to: "/admin/services", icon: Wrench },
  { label: "Bookings", to: "/admin/bookings", icon: CalendarDays },
];

export default function AdminSidebar() {
  return (
    <aside className="w-full shrink-0 bg-slate-950 p-5 text-white lg:min-h-[650px] lg:w-64">
      <div className="mb-8">
        <p className="text-xl font-bold">
          Service<span className="text-emerald-400">Hub</span>
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Admin Panel
        </p>
      </div>

      <nav className="space-y-2">
        {links.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-10 border-t border-slate-800 pt-5">
        <p className="text-sm font-semibold">Admin</p>

        <p className="mt-1 text-xs text-slate-500">
          admin@servicehub.com
        </p>
      </div>
    </aside>
  );
}