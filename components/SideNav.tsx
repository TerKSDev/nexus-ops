"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  GitMerge,
  Triangle,
  Settings,
  Book,
} from "lucide-react";

export const navLinks = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/repository", label: "Repository", icon: GitMerge },
  { href: "/deployment", label: "Deployment", icon: Triangle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen bg-neutral-900/80 backdrop-blur-xl border-r border-neutral-700/50 w-64 flex-col gap-6 px-4 py-6 shadow-[4px_0_24px_rgba(0,0,0,0.3)] z-10 relative">
      {/* Logo */}
      <div className="flex flex-col items-center w-full pb-6 border-b border-neutral-700/50 gap-1">
        <div className="text-neutral-50 text-3xl font-extrabold flex justify-center">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-healthy-400 to-cyan-200 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
            Nexus
          </span>
          Ops
        </div>
        {/* Decorative line under logo */}
        <div className="flex items-center gap-2 w-full justify-center">
          <div className="h-px flex-1 bg-linear-to-l from-neutral-700/60 to-transparent" />
          <span className="text-healthy-500/30 text-[7px]">◆</span>
          <div className="h-px flex-1 bg-linear-to-r from-neutral-700/60 to-transparent" />
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              href={link.href}
              key={link.label}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg font-medium transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? "bg-healthy-500/8 text-healthy-400 shadow-[0_0_12px_rgba(0,229,255,0.08)]"
                  : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60"
              }`}
            >
              {/* Active left accent bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-linear-to-b from-healthy-500/0 via-healthy-500 to-healthy-500/0 rounded-full" />
              )}
              {/* Hover background shimmer (inactive only) */}
              {!isActive && (
                <div className="absolute inset-0 bg-linear-to-r from-neutral-800/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                  isActive
                    ? "text-healthy-400 drop-shadow-[0_0_6px_rgba(0,229,255,0.5)]"
                    : "text-neutral-500 group-hover:text-neutral-300"
                }`}
              />
              <span
                className={`text-sm tracking-widest uppercase relative z-10 ${
                  isActive ? "text-healthy-400" : ""
                }`}
              >
                {link.label}
              </span>

              {/* Active diamond indicator on right */}
              {isActive && (
                <span className="ml-auto text-healthy-500/50 text-[7px] leading-none">
                  ◆
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/docs"
        className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60 font-medium transition-all duration-200 group relative overflow-hidden mt-auto`}
      >
        <Book className="w-4 h-4 shrink-0 transition-all duration-200" />
        DOCS
      </Link>
    </aside>
  );
}
