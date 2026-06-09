import prisma from "@/lib/prisma";
import {
  GitCommit,
  GitPullRequest,
  GitMerge,
  Check,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import AddRepoForm from "./components/AddRepoForm";
import RepoActions from "./components/RepoActions";
import Link from "next/link";
import FadeIn from "./components/FadeIn";
import CommitList from "./components/CommitList";
import { formatDistanceToNow } from "date-fns";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function formatTime(timeStr?: string) {
  if (!timeStr) return "unknown";
  try {
    return formatDistanceToNow(new Date(timeStr), { addSuffix: true });
  } catch (error) {
    console.log(error);
    return timeStr;
  }
}

export default async function RepositoryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const repos = await prisma.githubRepo.findMany({
    where: { userId: session.user.id },
    include: { logs: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 px-12 w-full max-w-7xl mx-auto flex flex-1 flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-1 bg-linear-to-b from-healthy-500 to-transparent" />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-neutral-50 to-neutral-400 tracking-tight uppercase">
              GitHub Repo
            </h1>
            <p className="text-neutral-400 tracking-wide text-base">
              Monitor your repositories, commits, and pull requests.
            </p>
          </div>
        </div>
        <AddRepoForm />
      </div>

      <div className="flex flex-col gap-8 flex-1">
        {repos.length > 0 ? (
          <>
            {repos.map((repo, repoIdx) => {
              // Sort logs descending by createdAt
              const sortedLogs = [...repo.logs].sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
              );
              const rawCommits = sortedLogs.filter(
                (log) => log.type === "COMMIT",
              );

              const rawPrs = sortedLogs.filter(
                (log) => log.type === "PULL_REQUEST",
              );
              const uniquePrsMap = new Map();
              for (const pr of rawPrs) {
                const meta = pr.metadata as { prNumber?: number };
                if (meta?.prNumber && !uniquePrsMap.has(meta.prNumber)) {
                  uniquePrsMap.set(meta.prNumber, pr);
                }
              }
              const prs = Array.from(uniquePrsMap.values()).slice(0, 5);
              return (
                <FadeIn
                  key={repo.id}
                  delay={repoIdx * 0.15}
                  className="flex flex-col gap-3 relative"
                >
                  {/* Repo Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-neutral-100 tracking-wider leading-tight">
                        {repo.name}
                      </h2>
                      {repo.isActive ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-healthy-500/10 border border-healthy-500/20 rounded-full select-none">
                          <div className="w-1 h-1 rounded-full bg-healthy-500 shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
                          <span className="text-[10px] font-bold text-healthy-500 uppercase tracking-wider leading-none">
                            Active
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-warning-500/10 border border-warning-500/20 rounded-full select-none">
                          <div className="w-1.5 h-1.5 rounded-full bg-warning-500 shadow-[0_0_8px_rgba(255,215,0,0.8)]" />
                          <span className="text-[10px] font-bold text-warning-500 uppercase tracking-wider leading-none">
                            Paused
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <Link
                        href={repo.url || ""}
                        className="text-xs px-3 py-1.5 bg-neutral-900 rounded-md border border-neutral-800 transition-colors duration-300 hover:bg-neutral-800 text-neutral-400"
                      >
                        {repo.url}
                      </Link>
                      <RepoActions
                        repoId={repo.id}
                        repoName={repo.name}
                        url={repo.url || ""}
                        isActive={repo.isActive}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-100 max-h-120">
                    {/* Recent Commits */}
                    <CommitList
                      rawCommits={rawCommits}
                      repoUrl={repo.url || ""}
                    />

                    {/* Recent Pull Requests */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
                      <div className="p-4 px-5 border-b border-neutral-800 flex items-center gap-3 bg-neutral-900 relative z-10">
                        <div className="p-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
                          <GitPullRequest className="w-4 h-4 text-neutral-300" />
                        </div>
                        <h3 className="text-base font-semibold text-neutral-50 tracking-wide">
                          Recent PRs
                        </h3>
                      </div>

                      {prs.length > 0 ? (
                        <div className="flex-1 divide-y divide-neutral-800 relative z-10 overflow-y-auto overflow-x-hidden max-h-[350px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 transition-colors pr-1">
                          {prs.map((pr, prIdx) => {
                            const meta = pr.metadata as {
                              title: string;
                              prNumber?: number;
                              author?: string;
                              time?: string;
                              description?: string;
                              state?: string;
                              merged?: boolean;
                              action?: string;
                            };

                            const isMerged = meta.merged === true;
                            const isClosed =
                              meta.state === "closed" && !isMerged;

                            return (
                              <FadeIn
                                delay={prIdx * 0.05}
                                direction="right"
                                key={pr.id}
                              >
                                <a
                                  href={`${repo.url}/pull/${meta.prNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group p-5 py-4 hover:bg-neutral-800 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4"
                                >
                                  <div className="flex flex-col gap-px overflow-hidden">
                                    <p className="text-neutral-200 font-medium group-hover:text-healthy-500 transition-colors line-clamp-1">
                                      {pr.message}
                                    </p>
                                    {meta.description && (
                                      <p className="text-neutral-400 text-xs line-clamp-2">
                                        {meta.description}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-3 text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors duration-300 font-mono mt-3">
                                      <span
                                        className={`${isMerged ? "text-purple-500" : "text-warning-500"}`}
                                      >
                                        #{meta.prNumber}
                                      </span>
                                      <span className="text-neutral-700">
                                        |
                                      </span>
                                      <span>{meta.author}</span>
                                      <span className="text-neutral-700">
                                        |
                                      </span>
                                      <span>{formatTime(meta.time)}</span>
                                    </div>
                                  </div>
                                  <div
                                    className={`p-2 rounded-full border shrink-0 ${
                                      isMerged
                                        ? "bg-purple-500/10 border-purple-700 text-purple-500 shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]"
                                        : isClosed
                                          ? "bg-critical-500/10 border-critical-700 text-critical-400 shadow-[inset_0_0_10px_rgba(255,0,123,0.2)]"
                                          : "bg-warning-500/10 border-warning-700 text-warning-500 shadow-[inset_0_0_10px_rgba(255,215,0,0.2)]"
                                    }`}
                                  >
                                    {isMerged ? (
                                      <GitMerge className="w-3 h-3 drop-shadow-[0_0_3px_rgba(168,85,247,0.8)]" />
                                    ) : isClosed ? (
                                      <X className="w-3 h-3 drop-shadow-[0_0_3px_rgba(255,0,123,0.8)]" />
                                    ) : (
                                      <GitPullRequest className="w-3 h-3 drop-shadow-[0_0_3px_rgba(255,215,0,0.8)]" />
                                    )}
                                  </div>
                                </a>
                              </FadeIn>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-10 flex-1 flex flex-col items-center justify-center text-center relative z-10">
                          <div className="w-15 h-15 bg-neutral-800 border border-neutral-700 rounded-lg rotate-45 flex items-center justify-center mb-10 shadow-inner">
                            <div className="-rotate-45">
                              <GitPullRequest className="w-6 h-6 text-neutral-300" />
                            </div>
                          </div>
                          <p className="text-neutral-100 font-medium mb-1.5 uppercase tracking-wide text-lg">
                            No Recent Pull Requests
                          </p>
                          <p className="text-neutral-400 text-xs max-w-100 leading-relaxed">
                            All caught up! There are no recent pull requests in
                            this repository.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 flex-1 border-2 border-dashed border-neutral-800 rounded-lg bg-neutral-900 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-healthy-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-healthy-500/10 transition-colors duration-700 animate-pulse" />
            <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center mb-8 shadow-2xl relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <GitMerge className="w-8 h-8 text-neutral-500 group-hover:text-healthy-400 transition-colors duration-500" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-100 mb-1.5 relative z-10 tracking-wide">
              No Repositories Tracked
            </h3>
            <p className="text-neutral-400 text-sm max-w-90 text-center leading-relaxed relative z-10">
              Your command center is empty. Paste a GitHub repository URL above
              to start syncing commits and pull requests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
