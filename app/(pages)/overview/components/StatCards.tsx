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
      <div className="bg-neutral-900 backdrop-blur-md border border-neutral-800 shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-lg p-6 flex items-center justify-between relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/30 transition-all" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-neutral-400 mb-1 uppercase tracking-wider">
            Active Repositories
          </p>
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">
            {activeReposCount}
          </p>
        </div>
        <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center relative z-10 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform">
          <Server className="text-blue-400 w-6 h-6 drop-shadow-[0_0_5px_rgba(59,130,246,0.6)]" />
        </div>
      </div>

      <div className="bg-neutral-900 backdrop-blur-md border border-neutral-800 shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-lg p-6 flex items-center justify-between relative overflow-hidden group hover:border-healthy-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-healthy-500/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-healthy-500/30 transition-all" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-neutral-400 mb-1 uppercase tracking-wider">
            Total Commits
          </p>
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-healthy-300 to-healthy-500 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
            {totalCommitsCount}
          </p>
        </div>
        <div className="w-14 h-14 bg-healthy-500/10 border border-healthy-500/30 rounded-full flex items-center justify-center relative z-10 shadow-[inset_0_0_15px_rgba(0,229,255,0.2)] group-hover:scale-110 transition-transform">
          <GitCommit className="text-healthy-400 w-7 h-7 drop-shadow-[0_0_5px_rgba(0,229,255,0.6)]" />
        </div>
      </div>

      <div className="bg-neutral-900 backdrop-blur-md border border-neutral-800 shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-lg p-6 flex items-center justify-between relative overflow-hidden group hover:border-warning-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-warning-500/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-warning-500/30 transition-all" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-neutral-400 mb-1 uppercase tracking-wider">
            Inactive Repos
          </p>
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-warning-300 to-warning-500 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
            {inactiveReposCount}
          </p>
        </div>
        <div className="w-14 h-14 bg-warning-500/10 border border-warning-500/30 rounded-full flex items-center justify-center relative z-10 shadow-[inset_0_0_15px_rgba(255,215,0,0.2)] group-hover:scale-110 transition-transform">
          <AlertCircle className="text-warning-400 w-7 h-7 drop-shadow-[0_0_5px_rgba(255,215,0,0.6)]" />
        </div>
      </div>
    </div>
  );
}
