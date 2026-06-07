import prisma from "@/lib/prisma";
import { GitMerge, GitCommit, GitPullRequest, Check, X } from "lucide-react";
import { addRepo } from "@/actions/repository";
import AddRepoForm from "./components/AddRepoForm";

export default async function RepositoryPage() {
  const repos = await prisma.githubRepo.findMany({
    include: { logs: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 px-12 w-full max-w-7xl mx-auto flex flex-1 flex-col gap-8">
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
            {repos.map((repo) => {
              const commits = repo.logs.filter((log) => log.type === "COMMIT");
              const prs = repo.logs.filter(
                (log) => log.type === "PULL_REQUEST",
              );
              return (
                <div key={repo.id} className="flex flex-col gap-6 relative">
                  {/* Repo Header */}
                  <div className="flex items-center justify-between border-b border-neutral-800/50 pb-4">
                    <h2 className="text-2xl font-bold text-neutral-50 tracking-wide">
                      {repo.name}
                    </h2>
                    <span className="text-xs font-mono px-3 py-1 bg-neutral-800/80 rounded-md border border-neutral-700 text-neutral-400">
                      {repo.url}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Commits */}
                    <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 shadow-xl rounded-2xl overflow-hidden flex flex-col relative group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-healthy-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                      <div className="p-6 border-b border-neutral-800/50 flex items-center justify-between bg-neutral-900/30 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-neutral-800/80 rounded-lg border border-neutral-700/50">
                            <GitCommit className="w-5 h-5 text-neutral-300" />
                          </div>
                          <h3 className="text-lg font-bold text-neutral-100 tracking-wide">
                            Recent Commits
                          </h3>
                        </div>
                      </div>

                      <div className="flex-1 divide-y divide-neutral-800/40 relative z-10">
                        {commits.map((commit) => {
                          const meta =
                            (commit.metadata as {
                              author?: string;
                              sha?: string;
                              time?: string;
                            }) || {};

                          return (
                            <div
                              key={commit.id}
                              className="p-5 hover:bg-neutral-800/40 transition-all duration-200 cursor-pointer flex items-center justify-between"
                            >
                              <div>
                                <p className="text-neutral-200 font-medium hover:text-healthy-400 transition-colors line-clamp-1">
                                  {commit.message}
                                </p>
                                <div className="flex items-center gap-3 mt-2 text-sm text-neutral-500 font-mono">
                                  <span className="text-neutral-400">
                                    {meta.sha || commit.id.substring(0, 7)}
                                  </span>
                                  <span className="text-neutral-700">|</span>
                                  <span>{meta.author || "unknown"}</span>
                                  <span className="text-neutral-700">|</span>
                                  <span>{meta.time || "unknown"}</span>
                                </div>
                              </div>
                              <div
                                className={`p-2 rounded-full border shrink-0 ml-4 ${
                                  commit.status === "HEALTHY"
                                    ? "bg-healthy-500/10 border-healthy-500/30 text-healthy-400 shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]"
                                    : "bg-critical-500/10 border-critical-500/30 text-critical-400 shadow-[inset_0_0_10px_rgba(255,0,123,0.2)]"
                                }`}
                              >
                                {commit.status === "HEALTHY" ? (
                                  <Check className="w-4 h-4 drop-shadow-[0_0_3px_rgba(0,229,255,0.8)]" />
                                ) : (
                                  <X className="w-4 h-4 drop-shadow-[0_0_3px_rgba(255,0,123,0.8)]" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Pull Requests */}
                    <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 shadow-xl rounded-2xl overflow-hidden flex flex-col relative">
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-warning-500/5 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />

                      <div className="p-6 border-b border-neutral-800/50 flex items-center gap-3 bg-neutral-900/30 relative z-10">
                        <div className="p-2 bg-neutral-800/80 rounded-lg border border-neutral-700/50">
                          <GitPullRequest className="w-5 h-5 text-neutral-300" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-100 tracking-wide">
                          Active PRs
                        </h3>
                      </div>

                      {prs.length > 0 ? (
                        <div className="flex-1 divide-y divide-neutral-800/40 relative z-10">
                          {prs.map((pr) => {
                            const meta = pr.metadata as {
                              title: string;
                              prNumber?: number;
                              author?: string;
                              time?: string;
                            };
                            return (
                              <div
                                key={pr.id}
                                className="p-5 hover:bg-neutral-800/40 transition-all duration-200 cursor-pointer flex items-center justify-between"
                              >
                                <div>
                                  <p className="text-neutral-200 font-medium hover:text-warning-400 transition-colors">
                                    {meta.title}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2 text-sm text-neutral-500 font-mono">
                                    <span className="text-warning-400/80">
                                      {pr.id}
                                    </span>
                                    <span className="text-neutral-700">|</span>
                                    <span>{meta.author}</span>
                                    <span className="text-neutral-700">|</span>
                                    <span>{meta.time}</span>
                                  </div>
                                </div>
                                <div className="p-2 rounded-lg bg-warning-500/10 border border-warning-500/30 text-warning-400 shadow-[inset_0_0_10px_rgba(255,215,0,0.1)]">
                                  <GitMerge className="w-4 h-4 drop-shadow-[0_0_3px_rgba(255,215,0,0.8)]" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 flex-1 flex flex-col items-center justify-center text-center relative z-10">
                          <div className="w-20 h-20 bg-neutral-800/50 border border-neutral-700/50 rounded-2xl rotate-45 flex items-center justify-center mb-8 shadow-inner">
                            <div className="-rotate-45">
                              <GitPullRequest className="w-8 h-8 text-neutral-500" />
                            </div>
                          </div>
                          <p className="text-neutral-300 font-medium mb-2 uppercase tracking-widest text-sm">
                            No Active Requests
                          </p>
                          <p className="text-neutral-400 text-sm max-w-100 leading-relaxed">
                            All caught up! There are no open pull requests in
                            this repository.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 flex-1 border-2 border-dashed border-neutral-800/60 rounded-3xl bg-neutral-900/20 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-healthy-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-healthy-500/10 transition-colors duration-700 animate-pulse" />
            <div className="w-20 h-20 bg-neutral-900/80 border border-neutral-800 rounded-2xl flex items-center justify-center mb-8 shadow-2xl relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
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
