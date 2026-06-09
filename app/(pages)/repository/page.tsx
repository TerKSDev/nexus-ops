import prisma from "@/lib/prisma";
import { GitMerge, ExternalLink } from "lucide-react";
import AddRepoForm from "./components/AddRepoForm";
import RepoActions from "./components/RepoActions";
import FadeIn from "./components/FadeIn";
import CommitList, { Log } from "./components/CommitList";
import PrList, { PrLog } from "./components/PrList";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RepositoryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const repos = await prisma.githubRepo.findMany({
    where: { userId: session.user.id },
    include: {
      logs: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 px-4 md:px-12 w-full max-w-7xl mx-auto flex flex-1 flex-col gap-8 md:gap-10">
      {/* Page Header — HSR style */}
      <div className="flex md:flex-row flex-col md:items-start justify-between gap-8">
        <div className="flex items-center gap-4">
          {/* Vertical accent bar with diamond cap */}
          <div className="flex flex-col items-center gap-1 self-stretch py-0.5">
            <div className="w-px flex-1 bg-linear-to-b from-healthy-500 via-healthy-500/40 to-transparent" />
            <span className="text-healthy-500 text-[7px] leading-none">◆</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-healthy-500/50 tracking-[0.3em] uppercase font-medium">
              Repository Monitor
            </span>
            <h1 className="text-3xl font-bold text-neutral-50 tracking-widest uppercase leading-none">
              GitHub Repo
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-px w-8 bg-linear-to-r from-healthy-500/40 to-transparent" />
              <p className="text-neutral-400 text-sm">
                Monitor your repositories, commits, and pull requests.
              </p>
            </div>
          </div>
        </div>
        <AddRepoForm />
      </div>

      {/* Repos List */}
      <div className="flex flex-col gap-10 flex-1">
        {repos.length > 0 ? (
          <>
            {repos.map((repo, repoIdx) => {
              const sortedLogs = [...repo.logs].sort((a, b) => {
                const timeA = new Date(
                  ((a.metadata as Record<string, unknown>)?.time as string) ||
                    a.createdAt,
                ).getTime();
                const timeB = new Date(
                  ((b.metadata as Record<string, unknown>)?.time as string) ||
                    b.createdAt,
                ).getTime();
                return timeB - timeA;
              });
              const rawCommits = sortedLogs.filter(
                (log) => log.type === "COMMIT",
              );

              const rawPrs = sortedLogs.filter(
                (log) => log.type === "PULL_REQUEST",
              );

              return (
                <FadeIn
                  key={repo.id}
                  delay={repoIdx * 0.15}
                  className="flex flex-col gap-4 relative"
                >
                  {/* Repo Section Header — HSR chapter style */}
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex gap-3 items-center">
                      <div className="w-0.5 h-4 bg-linear-to-b from-healthy-500 to-healthy-500/0 shrink-0" />
                      <h2 className="text-sm font-bold text-neutral-100 tracking-widest uppercase shrink-0">
                        {repo.name}
                      </h2>
                    </div>

                    {/* Status badge — small geometric style */}
                    {repo.isActive ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-healthy-500/5 border border-healthy-500/15 rounded-sm select-none">
                        <div className="w-1 h-1 rounded-full bg-healthy-500 shadow-[0_0_5px_rgba(0,229,255,0.8)] animate-pulse" />
                        <span className="text-[9px] font-bold text-healthy-500 uppercase tracking-[0.15em] leading-none">
                          Active
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-warning-500/5 border border-warning-500/15 rounded-sm select-none">
                        <div className="w-1 h-1 bg-warning-500 shadow-[0_0_5px_rgba(255,215,0,0.6)]" />
                        <span className="text-[9px] font-bold text-warning-500 uppercase tracking-[0.15em] leading-none">
                          Paused
                        </span>
                      </div>
                    )}

                    {/* Fading separator line */}
                    <div className="hidden md:flex flex-1 h-px bg-linear-to-r from-neutral-700/50 to-transparent" />

                    {/* Right: URL + actions */}
                    <div className="flex items-center gap-3 shrink-0 md:justify-end justify-between">
                      <a
                        href={repo.url || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-healthy-400 transition-colors duration-200 font-mono"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="max-w-52 truncate">{repo.url}</span>
                      </a>
                      <RepoActions
                        repoId={repo.id}
                        repoName={repo.name}
                        url={repo.url || ""}
                        isActive={repo.isActive}
                        autoMergePR={repo.autoMergePR}
                      />
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-150 max-h-170 md:min-h-100 md:max-h-120">
                    <CommitList
                      initialCommits={rawCommits as unknown as Log[]}
                      repoUrl={repo.url || ""}
                      repoId={repo.id}
                    />
                    <PrList
                      initialPrs={rawPrs as unknown as PrLog[]}
                      repoUrl={repo.url || ""}
                      repoId={repo.id}
                    />
                  </div>
                </FadeIn>
              );
            })}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-12 flex-1 border border-neutral-800/60 rounded-lg bg-neutral-900/50 relative overflow-hidden group">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-healthy-500/3 rounded-full blur-[100px] pointer-events-none group-hover:bg-healthy-500/6 transition-all duration-700" />

            {/* Corner bracket decorations */}
            <div className="absolute top-4 left-4 w-6 h-6 pointer-events-none opacity-25">
              <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-healthy-500 to-transparent" />
              <div className="absolute top-0 left-0 h-full w-px bg-linear-to-b from-healthy-500 to-transparent" />
            </div>
            <div className="absolute top-4 right-4 w-6 h-6 pointer-events-none opacity-25">
              <div className="absolute top-0 right-0 w-full h-px bg-linear-to-l from-healthy-500 to-transparent" />
              <div className="absolute top-0 right-0 h-full w-px bg-linear-to-b from-healthy-500 to-transparent" />
            </div>
            <div className="absolute bottom-4 left-4 w-6 h-6 pointer-events-none opacity-25">
              <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-healthy-500 to-transparent" />
              <div className="absolute bottom-0 left-0 h-full w-px bg-linear-to-t from-healthy-500 to-transparent" />
            </div>
            <div className="absolute bottom-4 right-4 w-6 h-6 pointer-events-none opacity-25">
              <div className="absolute bottom-0 right-0 w-full h-px bg-linear-to-l from-healthy-500 to-transparent" />
              <div className="absolute bottom-0 right-0 h-full w-px bg-linear-to-t from-healthy-500 to-transparent" />
            </div>

            {/* Icon — layered rings */}
            <div className="relative mb-8 z-10">
              <div className="w-20 h-20 rounded-full bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.06)] group-hover:shadow-[0_0_50px_rgba(0,229,255,0.12)] transition-all duration-700">
                <GitMerge className="w-8 h-8 text-neutral-400 group-hover:text-healthy-400 transition-colors duration-500" />
              </div>
              <div className="absolute inset-0 rounded-full border border-healthy-500/10 scale-[1.3] group-hover:border-healthy-500/20 transition-all duration-500" />
              <div className="absolute inset-0 rounded-full border border-healthy-500/5 scale-[1.65] group-hover:border-healthy-500/10 transition-all duration-700" />
            </div>

            <h3 className="text-xl font-bold text-neutral-100 mb-2 relative z-10 tracking-widest uppercase">
              No Repositories Tracked
            </h3>
            <div className="flex items-center gap-2 mb-3 z-10">
              <div className="h-px w-10 bg-linear-to-l from-neutral-700/60 to-transparent" />
              <span className="text-healthy-500/25 text-[8px]">◆</span>
              <div className="h-px w-10 bg-linear-to-r from-neutral-700/60 to-transparent" />
            </div>
            <p className="text-neutral-500 text-sm max-w-80 text-center leading-relaxed relative z-10">
              Paste a GitHub repository URL above to start syncing commits and
              pull requests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
