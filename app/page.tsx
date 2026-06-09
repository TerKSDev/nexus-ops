import Link from "next/link";
import { ArrowRight, TerminalSquare } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-healthy-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center flex-1 w-full">
        {/* Core Card matching Repo empty state */}
        <div className="flex flex-col items-center justify-center p-12 md:p-20 w-full border-2 border-dashed border-neutral-800 flex-1 bg-neutral-900 backdrop-blur-md relative overflow-hidden group shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-healthy-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-healthy-500/20 transition-colors duration-700 animate-pulse" />

          <div className="w-20 h-20 md:w-24 md:h-24 bg-neutral-900 border border-neutral-700 rounded-2xl flex items-center justify-center mb-10 shadow-2xl relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <div className="absolute inset-0 bg-linear-to-b from-healthy-500/10 to-transparent opacity-50 rounded-2xl" />
            <TerminalSquare className="w-10 h-10 md:w-12 md:h-12 text-neutral-500 group-hover:text-healthy-400 transition-colors duration-500 relative z-10" />
          </div>

          <div className="flex flex-col items-center text-center relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-1 bg-linear-to-b from-healthy-500 to-transparent" />
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-neutral-50 to-neutral-400 tracking-widest uppercase">
                Nexus Ops
              </h1>
              <div className="h-10 w-1 bg-linear-to-b from-healthy-500 to-transparent rotate-180" />
            </div>

            <p className="text-base md:text-lg text-neutral-400 mb-12 leading-relaxed max-w-2xl">
              Your cyberpunk command center. Monitor commits, active pull
              requests, and real-time deployment logs across all your tracked
              repositories.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                href="/overview"
                className="group flex items-center justify-center gap-3 bg-healthy-500/10 hover:bg-healthy-500/20 border border-healthy-500/30 hover:border-healthy-500/50 text-healthy-400 px-8 py-3.5 rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] w-full sm:w-auto"
              >
                <span>Initialize System</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#"
                className="group flex items-center justify-center gap-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-neutral-200 px-8 py-3.5 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-neutral-500 group-hover:text-neutral-300 transition-colors"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>Documentation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cyberpunk grid bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-[linear-gradient(to_top,rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none" />
    </div>
  );
}
