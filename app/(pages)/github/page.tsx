import { GitMerge, GitCommit, GitPullRequest, Check, X, RefreshCw } from "lucide-react";

const mockedRepos = [
  {
    id: "repo-1",
    name: "nexus-ops-web",
    branch: "main",
    status: "synced",
    commits: [
      { id: "c7a8b9", msg: "feat: redesign side navigation", author: "clmh92", status: "success", time: "10m ago" },
      { id: "e2f1d4", msg: "fix: update globals.css color scales", author: "clmh92", status: "success", time: "1h ago" },
      { id: "a5b3c2", msg: "chore: update dependencies", author: "dependabot", status: "failed", time: "3h ago" },
    ],
    prs: []
  },
  {
    id: "repo-2",
    name: "nexus-ops-api",
    branch: "develop",
    status: "syncing",
    commits: [
      { id: "f8d9e2", msg: "feat: add user authentication module", author: "clmh92", status: "success", time: "20m ago" },
      { id: "b4c5d6", msg: "fix: resolve database connection timeout", author: "clmh92", status: "success", time: "2h ago" },
    ],
    prs: [
      { id: "pr-12", title: "Feature: Rate Limiting Middleware", author: "clmh92", time: "1d ago" }
    ]
  }
];

export default function GithubPage() {
  return (
    <div className="p-8 px-12 w-full max-w-7xl mx-auto flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-1 bg-linear-to-b from-healthy-500 to-transparent" />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-neutral-50 to-neutral-400 tracking-tight uppercase">
              GitHub Sync
            </h1>
            <p className="text-neutral-400 tracking-wide text-sm font-medium">
              Monitor your repositories, commits, and pull requests.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            className="w-80 bg-neutral-900 backdrop-blur-md px-4 py-3 rounded-lg border border-neutral-800 focus:border-healthy-500 outline-none text-neutral-100 placeholder-neutral-400 transition-all shadow-inner font-mono text-sm"
            placeholder="https://github.com/user/repo"
          />
          <button className="bg-healthy-500 text-neutral-950 px-6 py-2.5 rounded-lg font-bold hover:bg-healthy-400 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
            Add Repo
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-16 mt-2">
        {mockedRepos.map((repo) => (
          <div key={repo.id} className="flex flex-col gap-6 relative">
            {/* Repo Header */}
            <div className="flex items-center justify-between border-b border-neutral-800/50 pb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-neutral-50 tracking-wide">{repo.name}</h2>
                <span className="text-xs font-mono px-3 py-1 bg-neutral-800/80 rounded-md border border-neutral-700 text-neutral-400">
                  branch: {repo.branch}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-neutral-900/60 backdrop-blur-md rounded-lg border border-neutral-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                {repo.status === "synced" ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-healthy-400 shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Synced</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-warning-400 animate-spin" />
                    <span className="text-xs font-bold text-warning-400 uppercase tracking-widest">Syncing</span>
                  </>
                )}
              </div>
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
                  {repo.commits.map((commit) => (
                    <div
                      key={commit.id}
                      className="p-5 hover:bg-neutral-800/40 transition-all duration-200 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="text-neutral-200 font-medium hover:text-healthy-400 transition-colors line-clamp-1">
                          {commit.msg}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-sm text-neutral-500 font-mono">
                          <span className="text-neutral-400">{commit.id}</span>
                          <span className="text-neutral-700">|</span>
                          <span>{commit.author}</span>
                          <span className="text-neutral-700">|</span>
                          <span>{commit.time}</span>
                        </div>
                      </div>
                      <div
                        className={`p-2 rounded-full border shrink-0 ml-4 ${
                          commit.status === "success"
                            ? "bg-healthy-500/10 border-healthy-500/30 text-healthy-400 shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]"
                            : "bg-critical-500/10 border-critical-500/30 text-critical-400 shadow-[inset_0_0_10px_rgba(255,0,123,0.2)]"
                        }`}
                      >
                        {commit.status === "success" ? (
                          <Check className="w-4 h-4 drop-shadow-[0_0_3px_rgba(0,229,255,0.8)]" />
                        ) : (
                          <X className="w-4 h-4 drop-shadow-[0_0_3px_rgba(255,0,123,0.8)]" />
                        )}
                      </div>
                    </div>
                  ))}
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

                {repo.prs.length > 0 ? (
                  <div className="flex-1 divide-y divide-neutral-800/40 relative z-10">
                    {repo.prs.map((pr) => (
                      <div key={pr.id} className="p-5 hover:bg-neutral-800/40 transition-all duration-200 cursor-pointer flex items-center justify-between">
                        <div>
                          <p className="text-neutral-200 font-medium hover:text-warning-400 transition-colors">
                            {pr.title}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-neutral-500 font-mono">
                            <span className="text-warning-400/80">{pr.id}</span>
                            <span className="text-neutral-700">|</span>
                            <span>{pr.author}</span>
                            <span className="text-neutral-700">|</span>
                            <span>{pr.time}</span>
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-warning-500/10 border border-warning-500/30 text-warning-400 shadow-[inset_0_0_10px_rgba(255,215,0,0.1)]">
                          <GitMerge className="w-4 h-4 drop-shadow-[0_0_3px_rgba(255,215,0,0.8)]" />
                        </div>
                      </div>
                    ))}
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
                    <p className="text-neutral-500 text-sm max-w-[280px] leading-relaxed">
                      All caught up! There are no open pull requests in this repository.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
