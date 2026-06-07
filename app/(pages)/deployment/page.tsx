import {
  Triangle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Globe,
} from "lucide-react";

export default function VercelPage() {
  return (
    <div className="p-8 px-12 w-full max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between relative">
        <div className="h-10 w-1 bg-linear-to-b from-healthy-500 to-transparent" />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-neutral-50 to-neutral-400 tracking-tight uppercase">
            Vercel Deployments
          </h1>
          <p className="text-neutral-400 tracking-wide text-sm font-medium">
            Track your application builds and deployments.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-neutral-100 text-neutral-950 font-bold rounded-xl hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300">
          <Triangle className="w-4 h-4 fill-current" />
          Deploy
        </button>
      </div>

      {/* Deployment List */}
      <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 shadow-xl rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-healthy-500/10 rounded-full blur-3xl -mt-24 pointer-events-none" />

        <div className="p-6 border-b border-neutral-800/50 flex items-center justify-between bg-neutral-900/30 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-800/80 rounded-lg border border-neutral-700/50">
              <Globe className="w-5 h-5 text-neutral-300" />
            </div>
            <h2 className="text-xl font-bold text-neutral-50 tracking-wide">
              Recent Deployments
            </h2>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-neutral-800/80 rounded-md border border-neutral-700 text-neutral-400 uppercase tracking-widest">
            nexus-ops-web
          </span>
        </div>

        <div className="divide-y divide-neutral-800/40 relative z-10">
          {[
            {
              id: "dpl_9x8A",
              status: "ready",
              env: "Production",
              time: "10m",
              branch: "main",
              commit: "feat: redesign side nav",
            },
            {
              id: "dpl_2b7C",
              status: "building",
              env: "Preview",
              time: "Just now",
              branch: "feat/new-ui",
              commit: "update globals.css",
            },
            {
              id: "dpl_4y6E",
              status: "error",
              env: "Preview",
              time: "1h",
              branch: "fix/auth",
              commit: "chore: update deps",
            },
            {
              id: "dpl_1a3D",
              status: "ready",
              env: "Production",
              time: "2d",
              branch: "main",
              commit: "Initial commit",
            },
          ].map((dpl) => (
            <div
              key={dpl.id}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-800/40 transition-all duration-200 group relative"
            >
              {dpl.status === "building" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-warning-400 shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
              )}
              {dpl.status === "error" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-critical-500 shadow-[0_0_10px_rgba(255,0,123,0.8)]" />
              )}

              <div className="flex items-start sm:items-center gap-5">
                <div className="mt-1 sm:mt-0 relative">
                  {dpl.status === "ready" ? (
                    <CheckCircle2 className="w-6 h-6 text-healthy-400 drop-shadow-[0_0_5px_rgba(0,229,255,0.6)]" />
                  ) : dpl.status === "building" ? (
                    <Clock className="w-6 h-6 text-warning-400 drop-shadow-[0_0_5px_rgba(255,215,0,0.6)] animate-pulse" />
                  ) : (
                    <XCircle className="w-6 h-6 text-critical-500 drop-shadow-[0_0_5px_rgba(255,0,123,0.6)]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span
                      className={`font-bold tracking-wide ${dpl.env === "Production" ? "text-neutral-100" : "text-neutral-400"}`}
                    >
                      {dpl.env}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded border border-neutral-700 bg-neutral-800/80 text-neutral-300 font-mono">
                      {dpl.branch}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    {dpl.commit}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8 sm:pl-0 pl-11">
                <div className="flex flex-col sm:items-end gap-1">
                  <span className="text-sm font-mono text-neutral-400">
                    {dpl.time} ago
                  </span>
                  <span className="text-xs font-mono text-neutral-600 bg-neutral-800/50 px-2 rounded">
                    {dpl.id}
                  </span>
                </div>
                <button className="p-2.5 rounded-lg border border-transparent hover:border-neutral-700 hover:bg-neutral-800/80 text-neutral-500 hover:text-healthy-400 transition-all duration-300 shadow-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
