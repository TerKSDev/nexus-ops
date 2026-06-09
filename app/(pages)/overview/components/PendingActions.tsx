"use client";

import { GitPullRequest } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import FadeIn from "@/app/(pages)/repository/components/FadeIn";

type LogWithRepo = {
  id: string;
  type: string;
  message: string;
  status: string;
  createdAt: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
  repo: { name: string; url: string | null } | null;
};

export default function PendingActions({
  recentPRs,
}: {
  recentPRs: LogWithRepo[];
}) {
  return (
    <div className="bg-neutral-900/70 border border-neutral-700/40 shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-lg overflow-hidden flex flex-col">
      {/* Panel Header — HSR style */}
      <div className="p-4 px-5 border-b border-neutral-700/40 flex items-center gap-3 bg-neutral-800/30 relative z-10">
        <div className="p-1.5 bg-healthy-500/10 rounded border border-healthy-500/20">
          <GitPullRequest className="w-4 h-4 text-healthy-400/80" />
        </div>
        <h3 className="text-sm font-bold text-neutral-100 tracking-widest uppercase">
          Pending Actions
        </h3>
        <div className="flex-1 h-px bg-linear-to-r from-neutral-700/60 to-transparent ml-1" />
      </div>

      <div className="flex-1 divide-y divide-neutral-800/60 overflow-y-auto max-h-[600px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600">
        {recentPRs.length > 0 ? (
          recentPRs.map((pr, idx) => {
            const meta =
              (pr.metadata as {
                author?: string;
                title?: string;
                prNumber?: number;
                action?: string;
                description?: string;
              }) || {};

            const link =
              pr.repo?.url && meta.prNumber
                ? `${pr.repo.url}/pull/${meta.prNumber}`
                : "#";

            return (
              <FadeIn delay={idx * 0.05} direction="left" key={pr.id}>
                <motion.a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col gap-2.5 p-5 cursor-pointer overflow-hidden"
                  initial="idle"
                  whileHover="hover"
                >
                  {/* Left sliding accent bar */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-warning-500/0 via-warning-400 to-warning-500/0"
                    variants={{
                      idle: { scaleY: 0, opacity: 0 },
                      hover: { scaleY: 1, opacity: 1 },
                    }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  />
                  {/* Hover background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-warning-500/4 to-transparent"
                    variants={{ idle: { opacity: 0 }, hover: { opacity: 1 } }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Top row: repo badge + time */}
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <span className="text-[9px] px-2 py-0.5 bg-neutral-800/60 border border-neutral-700/40 text-neutral-500 font-bold rounded tracking-widest uppercase group-hover:border-warning-500/25 group-hover:text-warning-400/70 transition-all shrink-0">
                      {pr.repo?.name}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-600 whitespace-nowrap">
                      {formatDistanceToNow(new Date(pr.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {/* PR title */}
                  <div className="flex flex-col gap-1 relative z-10">
                    <p className="text-sm font-medium text-neutral-200 group-hover:text-neutral-50 transition-colors duration-150 line-clamp-2">
                      {meta.title || pr.message}
                    </p>
                    {meta.description && (
                      <p className="text-neutral-600 text-xs line-clamp-2 leading-relaxed">
                        {meta.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom row: PR number + status badge */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-mono text-neutral-600 group-hover:text-neutral-500 transition-colors">
                      #{meta.prNumber}
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-warning-500/5 border border-warning-500/15 rounded-sm">
                      <div className="w-1 h-1 bg-warning-400 rounded-full shadow-[0_0_4px_rgba(255,215,0,0.6)] animate-pulse" />
                      <span className="text-[9px] font-bold text-warning-400 uppercase tracking-[0.15em] leading-none">
                        Needs Review
                      </span>
                    </div>
                  </div>
                </motion.a>
              </FadeIn>
            );
          })
        ) : (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="relative mb-7">
              <div className="w-16 h-16 rounded-full bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.05)]">
                <GitPullRequest className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="absolute inset-0 rounded-full border border-healthy-500/10 scale-[1.3]" />
            </div>
            <p className="text-neutral-100 font-bold uppercase tracking-widest text-sm mb-2">
              No Pending Actions
            </p>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-8 bg-linear-to-l from-neutral-700/60 to-transparent" />
              <span className="text-healthy-500/25 text-[8px]">◆</span>
              <div className="h-px w-8 bg-linear-to-r from-neutral-700/60 to-transparent" />
            </div>
            <p className="text-neutral-500 text-xs max-w-52 leading-relaxed">
              All caught up! No pending pull requests across your repositories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
