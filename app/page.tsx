import Link from "next/link";
import {
  ArrowRight,
  TerminalSquare,
  GitMerge,
  Triangle,
  Activity,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen relative overflow-hidden">
      {/* Multi-layer ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-healthy-500/[0.07] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-healthy-500/4 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,229,255,0.025)_1px,transparent_1px),linear-gradient(to_right,rgba(0,229,255,0.025)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)] pointer-events-none" />

      {/* Corner bracket decorations — full page corners */}
      <div className="absolute top-6 left-6 w-10 h-10 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-healthy-500 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-linear-to-b from-healthy-500 to-transparent" />
      </div>
      <div className="absolute top-6 right-6 w-10 h-10 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-full h-px bg-linear-to-l from-healthy-500 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-px bg-linear-to-b from-healthy-500 to-transparent" />
      </div>
      <div className="absolute bottom-6 left-6 w-10 h-10 pointer-events-none opacity-30">
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-healthy-500 to-transparent" />
        <div className="absolute bottom-0 left-0 h-full w-px bg-linear-to-t from-healthy-500 to-transparent" />
      </div>
      <div className="absolute bottom-6 right-6 w-10 h-10 pointer-events-none opacity-30">
        <div className="absolute bottom-0 right-0 w-full h-px bg-linear-to-l from-healthy-500 to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-linear-to-t from-healthy-500 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
        {/* Icon */}
        <div className="relative mb-10">
          <div className="w-24 h-24 rounded-full bg-neutral-900/80 border border-healthy-500/20 flex items-center justify-center shadow-[0_0_60px_rgba(0,229,255,0.1)] group-hover:shadow-[0_0_80px_rgba(0,229,255,0.2)] transition-all duration-700">
            <TerminalSquare className="w-10 h-10 text-healthy-400 drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
          </div>
          {/* Layered rings */}
          <div className="absolute inset-0 rounded-full border border-healthy-500/10 scale-[1.25] animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-healthy-500/6 scale-[1.6]" />
        </div>

        {/* Title */}
        <div className="flex items-center gap-5 mb-4">
          <div className="w-px h-12 bg-linear-to-b from-transparent via-healthy-500 to-transparent" />
          <h1 className="text-5xl md:text-6xl font-bold tracking-[0.15em] uppercase">
            <span className="text-neutral-50">Nexus</span>{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-healthy-400 to-healthy-200 drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              Ops
            </span>
          </h1>
          <div className="w-px h-12 bg-linear-to-b from-transparent via-healthy-500 to-transparent" />
        </div>

        {/* Diamond divider */}
        <div className="flex items-center gap-4 mb-6 w-full max-w-xs">
          <div className="flex-1 h-px bg-linear-to-r from-transparent to-healthy-500/30" />
          <span className="text-healthy-500/50 text-[8px]">◆ ◆ ◆</span>
          <div className="flex-1 h-px bg-linear-to-l from-transparent to-healthy-500/30" />
        </div>

        {/* Tagline */}
        <p className="text-base md:text-lg text-neutral-400 mb-3 leading-relaxed max-w-xl">
          Your cyberpunk command center. Monitor commits, active pull requests,
          and real-time deployment logs across all your tracked repositories.
        </p>
        <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] mb-12">
          GitHub · Webhooks · Real-time Sync
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {[
            { icon: GitMerge, label: "Repository Monitor" },
            { icon: Activity, label: "Activity Feed" },
            { icon: Triangle, label: "Deployment Tracking" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900/80 border border-neutral-700/40 rounded text-neutral-400 text-xs tracking-wider"
            >
              <Icon className="w-3 h-3 text-healthy-400/60" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
          <Link
            href="/login"
            className="group flex items-center justify-center gap-2 w-full text-nowrap bg-linear-to-r from-healthy-600 to-healthy-500 text-neutral-950 px-8 py-3 rounded-lg font-bold hover:from-healthy-500 hover:to-healthy-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.35)] transition-all duration-300 text-sm tracking-wide"
          >
            Initialize System
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="#"
            className="flex items-center justify-center gap-2 w-full bg-transparent border border-neutral-700/50 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600/60 hover:bg-neutral-800/40 px-8 py-3 rounded-lg font-medium transition-all duration-200 text-sm tracking-wide"
          >
            Documentation
          </Link>
        </div>

        {/* Version tag */}
        <p className="mt-12 text-[9px] text-neutral-600 uppercase tracking-[0.3em]">
          Nexus Ops · Command Center v1.0
        </p>
      </div>
    </div>
  );
}
