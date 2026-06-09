import { Server, GitCommit, AlertCircle } from "lucide-react";

interface StatCardsProps {
  activeReposCount: number;
  totalCommitsCount: number;
  inactiveReposCount: number;
}

export default function StatCards({
  activeReposCount,
  totalCommitsCount,
  inactiveReposCount,
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Active Repositories */}
      <div className="bg-neutral-900/70 border border-neutral-700/40 shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-lg p-6 flex items-center justify-between relative overflow-hidden group hover:border-healthy-500/20 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-healthy-500/50 via-healthy-500/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-healthy-500/[0.05] rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-healthy-500/[0.08] transition-all duration-500" />

        <div className="relative z-10">
          <p className="text-[10px] font-medium text-neutral-500 mb-2 uppercase tracking-widest">
            Active Repositories
          </p>
          <p className="text-4xl font-bold text-healthy-400 drop-shadow-[0_0_12px_rgba(0,229,255,0.3)]">
            {activeReposCount}
          </p>
        </div>

        <div className="w-12 h-12 bg-healthy-500/10 border border-healthy-500/20 rounded-full flex items-center justify-center relative z-10 shadow-[inset_0_0_12px_rgba(0,229,255,0.1)] group-hover:scale-110 transition-transform duration-300">
          <Server className="text-healthy-400/80 w-5 h-5" />
        </div>
      </div>

      {/* Total Commits */}
      <div className="bg-neutral-900/70 border border-neutral-700/40 shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-lg p-6 flex items-center justify-between relative overflow-hidden group hover:border-purple-500/20 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-purple-500/50 via-purple-500/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.05] rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/[0.08] transition-all duration-500" />

        <div className="relative z-10">
          <p className="text-[10px] font-medium text-neutral-500 mb-2 uppercase tracking-widest">
            Total Commits
          </p>
          <p className="text-4xl font-bold text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            {totalCommitsCount}
          </p>
        </div>

        <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center relative z-10 shadow-[inset_0_0_12px_rgba(168,85,247,0.1)] group-hover:scale-110 transition-transform duration-300">
          <GitCommit className="text-purple-400/80 w-5 h-5" />
        </div>
      </div>

      {/* Inactive Repos */}
      <div className="bg-neutral-900/70 border border-neutral-700/40 shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-lg p-6 flex items-center justify-between relative overflow-hidden group hover:border-warning-500/20 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-warning-500/50 via-warning-500/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-warning-500/[0.05] rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-warning-500/[0.08] transition-all duration-500" />

        <div className="relative z-10">
          <p className="text-[10px] font-medium text-neutral-500 mb-2 uppercase tracking-widest">
            Inactive Repos
          </p>
          <p className="text-4xl font-bold text-warning-400 drop-shadow-[0_0_12px_rgba(255,215,0,0.3)]">
            {inactiveReposCount}
          </p>
        </div>

        <div className="w-12 h-12 bg-warning-500/10 border border-warning-500/20 rounded-full flex items-center justify-center relative z-10 shadow-[inset_0_0_12px_rgba(255,215,0,0.1)] group-hover:scale-110 transition-transform duration-300">
          <AlertCircle className="text-warning-400/80 w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
