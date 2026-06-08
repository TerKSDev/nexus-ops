import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Activity,
  Server,
  AlertCircle,
  ChevronRight,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import FadeIn from "@/app/(pages)/repository/components/FadeIn";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 1. Fetch Stats
  const activeReposCount = await prisma.githubRepo.count({
    where: { userId: session.user.id, isActive: true },
  });

  const totalCommitsCount = await prisma.logs.count({
    where: { repo: { userId: session.user.id }, type: "COMMIT" },
  });

  const inactiveReposCount = await prisma.githubRepo.count({
    where: { userId: session.user.id, isActive: false },
  });

  // 2. Fetch Global Recent Logs
  const recentLogs = await prisma.logs.findMany({
    where: { repo: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { repo: true },
  });

  return (
    <div className="p-8 px-12 w-full max-w-7xl mx-auto flex flex-col gap-10">
      <div className="flex gap-4 items-center">
        <div className="h-10 w-1 bg-linear-to-b from-healthy-500 to-transparent" />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-neutral-50 to-neutral-400 tracking-tight uppercase">
            Overview
          </h1>
          <p className="text-neutral-400 tracking-wide text-sm font-medium">
            View all of your system status and active alerts.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
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

      {/* Recent Activity */}
      <div className="bg-neutral-900 backdrop-blur-md border border-neutral-800 shadow-xl rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-b from-neutral-800 to-transparent pointer-events-none" />

        <div className="p-6 border-b border-neutral-800 flex items-center gap-3 relative z-10 bg-neutral-900">
          <div className="p-2 bg-neutral-800 rounded-lg border border-neutral-700/50">
            <Activity className="w-5 h-5 text-neutral-300" />
          </div>
          <h2 className="text-xl font-bold text-neutral-50 tracking-wide">
            Global Activity Feed
          </h2>
          <div className="ml-auto flex items-center gap-1 text-xs font-mono text-neutral-500">
            <span>LIVE_SYNC</span>
            <span className="w-1.5 h-1.5 rounded-full bg-healthy-500 animate-pulse ml-2" />
          </div>
        </div>

        <div className="divide-y divide-neutral-800 relative z-10 max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600">
          {recentLogs.length > 0 ? (
            recentLogs.map((log, logIdx) => {
              const meta =
                (log.metadata as {
                  author?: string;
                  sha?: string;
                  title?: string;
                  number?: number;
                  action?: string;
                }) || {};

              const isCommit = log.type === "COMMIT";
              const isPR = log.type === "PULL_REQUEST";

              return (
                <FadeIn delay={logIdx * 0.05} direction="left" key={log.id}>
                  <div className="group p-5 py-4 hover:bg-neutral-800 transition-all duration-300 cursor-pointer flex items-center justify-between">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        {isCommit && <GitCommit className="w-4 h-4 text-neutral-500 group-hover:text-healthy-500 transition-colors" />}
                        {isPR && <GitPullRequest className="w-4 h-4 text-neutral-500 group-hover:text-healthy-500 transition-colors" />}
                        <span className="bg-neutral-800/80 px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider text-neutral-400 border border-neutral-700 uppercase group-hover:border-healthy-500/50 group-hover:text-healthy-400 transition-colors">
                          {log.repo?.name || "System"}
                        </span>
                        <p className="text-neutral-200 font-medium group-hover:text-healthy-500 transition-colors line-clamp-1">
                          {log.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors duration-300 font-mono mt-0.5 ml-6">
                        <span>
                          {isCommit && meta.sha ? `#${meta.sha.substring(0, 7)}` : isPR && meta.number ? `#${meta.number}` : "SYS_LOG"}
                        </span>
                        <span className="text-neutral-700">|</span>
                        <span>{meta.author || "system"}</span>
                        {meta.action && (
                          <>
                            <span className="text-neutral-700">|</span>
                            <span className="text-neutral-400">{meta.action}</span>
                          </>
                        )}
                        <span className="text-neutral-700">|</span>
                        <span>
                          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-2 rounded-full border shrink-0 ${
                        log.status === "HEALTHY"
                          ? "bg-healthy-500/10 border-healthy-700 text-healthy-400 shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]"
                          : log.status === "WARNING"
                            ? "bg-warning-500/10 border-warning-700 text-warning-400 shadow-[inset_0_0_10px_rgba(255,215,0,0.2)]"
                            : log.status === "CRITICAL"
                              ? "bg-critical-500/10 border-critical-700 text-critical-400 shadow-[inset_0_0_10px_rgba(255,0,123,0.2)]"
                              : "bg-neutral-800 border-neutral-700 text-neutral-400"
                      }`}
                    >
                      {log.status === "HEALTHY" ? (
                        <CheckCircle2 className="w-3 h-3 drop-shadow-[0_0_3px_rgba(0,229,255,0.8)]" />
                      ) : log.status === "WARNING" ? (
                        <AlertCircle className="w-3 h-3 drop-shadow-[0_0_3px_rgba(255,215,0,0.8)]" />
                      ) : log.status === "CRITICAL" ? (
                        <Activity className="w-3 h-3 drop-shadow-[0_0_3px_rgba(255,0,123,0.8)]" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </FadeIn>
              );
            })
          ) : (
            <div className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-4">
              <Activity className="w-8 h-8 text-neutral-700" />
              <p>No system activity detected yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
