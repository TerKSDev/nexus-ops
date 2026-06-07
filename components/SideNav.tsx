"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  GitMerge,
  Triangle,
  BarChart3,
  Settings,
} from "lucide-react";

export const navLinks = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/repository", label: "Repository", icon: GitMerge },
  { href: "/deployment", label: "Deployment", icon: Triangle },
  { href: "#", label: "Reports", icon: BarChart3 },
  { href: "#", label: "Settings", icon: Settings },
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen bg-neutral-900 backdrop-blur-xl border-r border-neutral-700 w-64 flex-col gap-6 px-4 py-6 shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-10 relative">
      <div className="text-neutral-50 text-3xl font-extrabold flex justify-center w-full pb-6 border-b border-neutral-800/50">
        <span className="text-transparent bg-clip-text bg-linear-to-r from-healthy-400 to-cyan-200 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
          Nexus
        </span>
        Ops
      </div>
      <nav className="flex flex-col gap-3">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              href={link.href}
              key={link.label}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-300 group border relative overflow-hidden ${
                isActive
                  ? "bg-healthy-500/10 text-healthy-400 border-healthy-500/30 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                  : "border-transparent text-neutral-300 hover:bg-neutral-800/40 hover:text-neutral-50 hover:border-neutral-700/50"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-healthy-400 shadow-[0_0_10px_rgba(0,229,255,0.8)] rounded-r-full" />
              )}
              <Icon
                className={`w-5 h-5 transition-colors duration-300 ${
                  isActive
                    ? "text-healthy-400 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]"
                    : "text-neutral-400 group-hover:text-neutral-200"
                }`}
              />
              <span className="tracking-wide">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
