"use client";

import { useState, useEffect, useRef } from "react";
import { GitPullRequest, GitMerge, X, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import FadeIn from "./FadeIn";
import { formatDistanceToNow } from "date-fns";
import { getMoreRepoLogs } from "@/actions/logs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrLog = any;

function formatTime(timeStr?: string) {
  if (!timeStr) return "unknown";
  try {
    return formatDistanceToNow(new Date(timeStr), { addSuffix: true });
  } catch {
    return timeStr;
  }
}

export default function PrList({
  initialPrs,
  repoUrl,
  repoId,
}: {
  initialPrs: PrLog[];
  repoUrl: string;
  repoId: string;
}) {
  const [prs, setPrs] = useState<PrLog[]>(initialPrs);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

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
  }, [hasMore, loadingMore, prs]);

  const loadMore = async () => {
    setLoadingMore(true);
    const { data, error } = await getMoreRepoLogs(
      repoId,
      "PULL_REQUEST",
      prs.length,
      20,
    );

    if (!error && data) {
      if (data.length < 20) {
        setHasMore(false);
      }

      setPrs((prev) => {
        const uniquePrsMap = new Map();
        [...prev, ...data].forEach((pr) => {
          const meta = pr.metadata as any;
          if (meta?.prNumber && !uniquePrsMap.has(meta.prNumber)) {
            uniquePrsMap.set(meta.prNumber, pr);
          } else if (!meta?.prNumber) {
            uniquePrsMap.set(pr.id, pr);
          }
        });
        return Array.from(uniquePrsMap.values());
      });
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  return (
    <div className="bg-neutral-900/70 border border-neutral-700/40 rounded-lg overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Panel Header */}
      <div className="p-4 px-5 border-b border-neutral-700/40 flex items-center gap-3 bg-neutral-800/30 relative z-10">
        <div className="p-1.5 bg-healthy-500/10 rounded border border-healthy-500/20">
          <GitPullRequest className="w-4 h-4 text-healthy-400/80" />
        </div>
        <h3 className="text-sm font-bold text-neutral-100 tracking-widest uppercase">
          Recent PRs
        </h3>
        <div className="flex-1 h-px bg-linear-to-r from-neutral-700/60 to-transparent ml-1" />
      </div>

      {prs.length > 0 ? (
        <div className="flex-1 divide-y divide-neutral-800/60 relative z-10 overflow-y-auto overflow-x-hidden max-h-[350px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 transition-colors pr-1">
          {prs.map((pr: PrLog, prIdx: number) => {
            const meta = pr.metadata as {
              title?: string;
              prNumber?: number;
              author?: string;
              time?: string;
              description?: string;
              state?: string;
              merged?: boolean;
            };

            const isMerged = meta.merged === true;
            const isClosed = meta.state === "closed" && !isMerged;

            return (
              <FadeIn
                key={pr.id}
                delay={prIdx < 10 ? prIdx * 0.05 : 0}
                direction="right"
              >
                <motion.a
                  href={`${repoUrl}/pull/${meta.prNumber}`}
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
                    className="absolute inset-0 bg-linear-to-r from-healthy-500/[0.06] to-transparent"
                    variants={{
                      idle: { opacity: 0 },
                      hover: { opacity: 1 },
                    }}
                    transition={{ duration: 0.2 }}
                  />

                  <div className="flex flex-col gap-px overflow-hidden relative z-10">
                    <p className="text-neutral-200 font-medium group-hover:text-neutral-50 transition-colors duration-150 line-clamp-1">
                      {pr.message}
                    </p>
                    {meta.description && (
                      <p className="text-neutral-400 text-xs line-clamp-2 group-hover:text-neutral-300 transition-colors duration-200">
                        {meta.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors duration-200 font-mono mt-2">
                      <span
                        className={
                          isMerged
                            ? "text-purple-400/80"
                            : "text-warning-400/70"
                        }
                      >
                        #{meta.prNumber}
                      </span>
                      <span className="text-neutral-700">·</span>
                      <span>{meta.author}</span>
                      <span className="text-neutral-700">·</span>
                      <span>{formatTime(meta.time)}</span>
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded-full border shrink-0 relative z-10 ${
                      isMerged
                        ? "bg-purple-500/10 border-purple-700/50 text-purple-400 shadow-[inset_0_0_8px_rgba(168,85,247,0.15)]"
                        : isClosed
                          ? "bg-critical-500/10 border-critical-700/50 text-critical-400 shadow-[inset_0_0_8px_rgba(255,0,123,0.15)]"
                          : "bg-warning-500/10 border-warning-700/50 text-warning-400 shadow-[inset_0_0_8px_rgba(255,215,0,0.15)]"
                    }`}
                  >
                    {isMerged ? (
                      <GitMerge className="w-3 h-3" />
                    ) : isClosed ? (
                      <X className="w-3 h-3" />
                    ) : (
                      <GitPullRequest className="w-3 h-3" />
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
              <GitPullRequest className="w-6 h-6 text-neutral-400" />
            </div>
            <div className="absolute inset-0 rounded-full border border-healthy-500/10 scale-[1.3]" />
          </div>
          <p className="text-neutral-100 font-bold uppercase tracking-widest text-sm mb-2">
            No Recent Pull Requests
          </p>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-linear-to-l from-neutral-700/60 to-transparent" />
            <span className="text-healthy-500/25 text-[8px]">◆</span>
            <div className="h-px w-8 bg-linear-to-r from-neutral-700/60 to-transparent" />
          </div>
          <p className="text-neutral-500 text-xs max-w-52 leading-relaxed">
            All caught up! There are no recent pull requests in this repository.
          </p>
        </div>
      )}
    </div>
  );
}
