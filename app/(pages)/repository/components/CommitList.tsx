"use client";

import { useState } from "react";
import { GitCommit, Check, X, GitBranch } from "lucide-react";
import FadeIn from "./FadeIn";
import { formatDistanceToNow } from "date-fns";

type Log = any; // Assuming Prisma log type

function formatTime(timeStr?: string) {
  if (!timeStr) return "unknown";
  try {
    return formatDistanceToNow(new Date(timeStr), { addSuffix: true });
  } catch (error) {
    return timeStr;
  }
}

export default function CommitList({ rawCommits, repoUrl }: { rawCommits: Log[], repoUrl: string }) {
  const [selectedBranch, setSelectedBranch] = useState("main");

  // Get unique branches from commits
  const branches = Array.from(
    new Set(
      rawCommits
        .map((c) => (c.metadata as any)?.branch)
        .filter(Boolean)
    )
  );
  if (!branches.includes("main")) branches.push("main");

  // Filter by branch and deduplicate by SHA
  const uniqueCommitsMap = new Map();
  for (const commit of rawCommits) {
    const meta = commit.metadata as any;
    const branch = meta?.branch || "main"; // Default to main for old logs
    if (branch === selectedBranch && meta?.sha && !uniqueCommitsMap.has(meta.sha)) {
      uniqueCommitsMap.set(meta.sha, commit);
    }
  }
  
  const displayCommits = Array.from(uniqueCommitsMap.values()).slice(0, 5);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 px-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
            <GitCommit className="w-4 h-4 text-neutral-300" />
          </div>
          <h3 className="text-base font-semibold text-neutral-50 tracking-wide">
            Recent Commits
          </h3>
        </div>
        
        {/* Branch Switcher */}
        <div className="flex items-center gap-2 relative">
          <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <GitBranch className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="pl-8 pr-8 py-1.5 bg-neutral-950 border border-neutral-800 rounded-md text-xs font-medium text-neutral-300 focus:outline-none focus:ring-1 focus:ring-healthy-500/50 focus:border-healthy-500/50 appearance-none cursor-pointer hover:bg-neutral-900 transition-colors"
          >
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {displayCommits.length > 0 ? (
        <div className="flex-1 divide-y divide-neutral-800 relative z-10 overflow-y-auto overflow-x-hidden max-h-[350px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 transition-colors pr-1">
          {displayCommits.map((commit, commitIdx) => {
            const meta = (commit.metadata || {}) as any;

            return (
              <FadeIn
                delay={commitIdx * 0.05}
                direction="left"
                key={commit.id}
              >
                <a
                  href={`${repoUrl}/commit/${meta.sha || commit.id.substring(0, 7)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 py-4 hover:bg-neutral-800 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5 overflow-hidden">
                    <p className="text-neutral-200 font-medium group-hover:text-healthy-500 transition-colors line-clamp-1">
                      {commit.message}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors duration-300 font-mono">
                      <span>
                        #{meta.sha || commit.id.substring(0, 7)}
                      </span>
                      <span className="text-neutral-700">|</span>
                      <span>{meta.author || "unknown"}</span>
                      <span className="text-neutral-700">|</span>
                      <span>{formatTime(meta.time)}</span>
                    </div>
                  </div>
                  <div
                    className={`p-2 rounded-full border shrink-0 ${
                      commit.status === "HEALTHY"
                        ? "bg-healthy-500/10 border-healthy-700 text-healthy-400 shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]"
                        : "bg-critical-500/10 border-critical-700 text-critical-400 shadow-[inset_0_0_10px_rgba(255,0,123,0.2)]"
                    }`}
                  >
                    {commit.status === "HEALTHY" ? (
                      <Check className="w-3 h-3 drop-shadow-[0_0_3px_rgba(0,229,255,0.8)]" />
                    ) : (
                      <X className="w-3 h-3 drop-shadow-[0_0_3px_rgba(255,0,123,0.8)]" />
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
              <GitCommit className="w-6 h-6 text-neutral-300" />
            </div>
          </div>
          <p className="text-neutral-100 font-medium mb-1.5 uppercase tracking-wide text-lg">
            No Commits Found
          </p>
          <p className="text-neutral-400 text-xs max-w-100 leading-relaxed">
            There are no commits found in the selected branch.
          </p>
        </div>
      )}
    </div>
  );
}
