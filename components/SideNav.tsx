import Link from "next/link";
import {
  LayoutDashboard,
  Server,
  Bell,
  BarChart3,
  Settings,
} from "lucide-react";

export const navLinks = [
  { href: "#", label: "Dashboard", icon: LayoutDashboard },
  { href: "#", label: "Devices", icon: Server },
  { href: "#", label: "Alerts", icon: Bell },
  { href: "#", label: "Reports", icon: BarChart3 },
  { href: "#", label: "Settings", icon: Settings },
];

export default function SideNav() {
  return (
    <aside className="flex h-screen bg-neutral-900 border-r border-neutral-800 w-64 flex-col gap-6 px-3 py-6">
      <div className="text-neutral-50 text-3xl font-extrabold flex justify-center w-full border-b border-neutral-800/50">
        <span className="text-healthy-500">Nexus</span>Ops
      </div>
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              href={link.href}
              key={link.label}
              className="flex items-center gap-4 px-3 py-2 rounded-lg text-neutral-400 font-medium transition-all duration-200 hover:bg-healthy-500/10 hover:text-healthy-500 group"
            >
              <Icon className="w-4 h-4 transition-colors duration-200 group-hover:text-healthy-500" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
