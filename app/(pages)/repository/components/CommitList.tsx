"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GitCommit, Check, X, GitBranch, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import FadeIn from "./FadeIn";
import { formatDistanceToNow } from "date-fns";
import { getMoreRepoLogs } from "@/actions/logs";

export type LogMetadata = {
  branch?: string;
  sha?: string;
  author?: string;
  time?: string;
};

export type Log = {
  id: string;
  type: string;
  message: string;
  status: string;
  createdAt: Date;
  metadata: LogMetadata;
  repoId: string;
};

function formatTime(timeStr?: string) {
  if (!timeStr) return "unknown";
  try {
    return formatDistanceToNow(new Date(timeStr), { addSuffix: true });
  } catch {
    return timeStr;
  }
}

export default function CommitList({
  initialCommits,
  repoUrl,
  repoId,
}: {
  initialCommits: Log[];
  repoUrl: string;
  repoId: string;
}) {
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [commits, setCommits] = useState<Log[]>(initialCommits);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Assuming there might be more initially
  const observerRef = useRef<HTMLDivElement>(null);

  // Get unique branches from commits
  const branches = Array.from(
    new Set(initialCommits.map((c) => c.metadata?.branch).filter(Boolean)),
  );
  if (!branches.includes("main")) branches.push("main");

  useEffect(() => {
    // Reset commits and pagination when branch changes
    const branchCommits = initialCommits.filter(
      (c) => (c.metadata?.branch || "main") === selectedBranch,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCommits(branchCommits);
    setHasMore(true);
  }, [selectedBranch, initialCommits]);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    const { data, error } = await getMoreRepoLogs(
      repoId,
      "COMMIT",
      commits.length,
      20,
      selectedBranch,
    );

    if (!error && data) {
      if (data.length < 20) {
        setHasMore(false);
      }
      // Avoid duplicate commits by SHA
      setCommits((prev) => {
        const uniqueCommitsMap = new Map();
        [...prev, ...data].forEach((commit) => {
          const meta = commit.metadata as LogMetadata;
          if (meta?.sha && !uniqueCommitsMap.has(meta.sha)) {
            uniqueCommitsMap.set(meta.sha, commit as unknown as Log);
          } else if (!meta?.sha) {
            uniqueCommitsMap.set(commit.id, commit as unknown as Log);
          }
        });
        return Array.from(uniqueCommitsMap.values());
      });
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  }, [repoId, commits.length, selectedBranch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  const displayCommits = commits;

  return (
    <div className="bg-neutral-900/70 border border-neutral-700/40 rounded-lg overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Panel Header */}
      <div className="p-4 px-5 border-b border-neutral-700/40 flex items-center justify-between bg-neutral-800/30 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-healthy-500/10 rounded border border-healthy-500/20">
            <GitCommit className="w-4 h-4 text-healthy-400/80" />
          </div>
          <h3 className="text-sm font-bold text-neutral-100 tracking-widest uppercase">
            Recent Commits
          </h3>
          <div className="w-10 h-px bg-linear-to-r from-neutral-700/60 to-transparent" />
        </div>

        {/* Branch Switcher */}
        <div className="group flex items-center gap-2 relative">
          <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-healthy-400 transition-colors">
            <GitBranch className="w-3 h-3" />
          </div>
          <select
            aria-label="Select branch"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="pl-7 pr-7 py-1.5 bg-neutral-900/80 border border-neutral-700/50 rounded text-[11px] font-medium text-neutral-400 focus:outline-none focus:text-neutral-100 focus:bg-healthy-500/5 focus:border-healthy-500/40 appearance-none cursor-pointer hover:text-neutral-200 hover:border-neutral-600 transition-all tracking-wider"
          >
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <svg
              className="w-2.5 h-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {displayCommits.length > 0 ? (
        <div className="flex-1 divide-y divide-neutral-800/60 relative z-10 overflow-y-auto overflow-x-hidden max-h-[350px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 transition-colors pr-1">
          {displayCommits.map((commit, commitIdx) => {
            const meta = (commit.metadata || {}) as LogMetadata;

            return (
              <FadeIn
                delay={commitIdx < 10 ? commitIdx * 0.05 : 0}
                direction="left"
                key={commit.id}
              >
                <motion.a
                  href={`${repoUrl}/commit/${meta.sha || commit.id.substring(0, 7)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-between gap-4 p-5 py-4 cursor-pointer overflow-hidden"
                  initial="idle"
                  whileHover="hover"
                >
                  {/* Left sliding accent bar */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-healthy-500/0 via-healthy-500 to-healthy-500/0"
                    variants={{
                      idle: { scaleY: 0, opacity: 0 },
                      hover: { scaleY: 1, opacity: 1 },
                    }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  />
                  {/* Hover background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-healthy-500/6 to-transparent"
                    variants={{
                      idle: { opacity: 0 },
                      hover: { opacity: 1 },
                    }}
                    transition={{ duration: 0.2 }}
                  />

                  <div className="flex flex-col gap-1.5 overflow-hidden relative z-10">
                    <p className="text-neutral-200 font-medium group-hover:text-neutral-50 transition-colors duration-150 line-clamp-1">
                      {commit.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors duration-150 font-mono">
                      <span className="text-healthy-400/60">
                        #
                        {meta.sha?.substring(0, 7) || commit.id.substring(0, 7)}
                      </span>
                      <span className="text-neutral-700">·</span>
                      <span>{meta.author || "unknown"}</span>
                      <span className="text-neutral-700">·</span>
                      <span>{formatTime(meta.time)}</span>
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded-full border shrink-0 relative z-10 ${
                      commit.status === "HEALTHY"
                        ? "bg-healthy-500/10 border-healthy-700/50 text-healthy-400 shadow-[inset_0_0_8px_rgba(0,229,255,0.15)]"
                        : "bg-critical-500/10 border-critical-700/50 text-critical-400 shadow-[inset_0_0_8px_rgba(255,0,123,0.15)]"
                    }`}
                  >
                    {commit.status === "HEALTHY" ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                  </div>
                </motion.a>
              </FadeIn>
            );
          })}

          {/* Infinite Scroll trigger element */}
          {hasMore && (
            <div
              ref={observerRef}
              className="p-4 flex items-center justify-center relative z-10"
            >
              {loadingMore ? (
                <div className="flex items-center gap-2 text-healthy-500/60">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-[10px] tracking-widest uppercase font-bold">
                    Syncing...
                  </span>
                </div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-neutral-800" />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-10 flex-1 flex flex-col items-center justify-center text-center relative z-10">
          <div className="relative mb-7">
            <div className="w-16 h-16 rounded-full bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.05)]">
              <GitCommit className="w-6 h-6 text-neutral-400" />
            </div>
            <div className="absolute inset-0 rounded-full border border-healthy-500/10 scale-[1.3]" />
          </div>
          <p className="text-neutral-100 font-bold uppercase tracking-widest text-sm mb-2">
            No Commits Found
          </p>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-linear-to-l from-neutral-700/60 to-transparent" />
            <span className="text-healthy-500/25 text-[8px]">◆</span>
            <div className="h-px w-8 bg-linear-to-r from-neutral-700/60 to-transparent" />
          </div>
          <p className="text-neutral-500 text-xs max-w-52 leading-relaxed">
            There are no commits found in the selected branch.
          </p>
        </div>
      )}
    </div>
  );
}
