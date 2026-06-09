"use client";

import {
  Activity,
  GitCommit,
  GitPullRequest,
  Check,
  AlertCircle,
} from "lucide-react";
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

export default function GlobalActivityFeed({
  recentLogs,
}: {
  recentLogs: LogWithRepo[];
}) {
  return (
    <div className="bg-neutral-900/70 border border-neutral-700/40 shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-lg overflow-hidden flex flex-col">
      {/* Panel Header — HSR style */}
      <div className="p-4 px-5 border-b border-neutral-700/40 flex items-center gap-3 bg-neutral-800/30 relative z-10">
        <div className="p-1.5 bg-healthy-500/10 rounded border border-healthy-500/20">
          <Activity className="w-4 h-4 text-healthy-400/80" />
        </div>
        <h3 className="text-sm font-bold text-neutral-100 tracking-widest uppercase">
          Global Activity Feed
        </h3>
        <div className="flex-1 h-px bg-linear-to-r from-neutral-700/60 to-transparent ml-1" />
        {/* LIVE_SYNC badge — geometric */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-healthy-500/5 border border-healthy-500/15 rounded-sm select-none shrink-0">
          <div className="w-1 h-1 rounded-full bg-healthy-500 shadow-[0_0_5px_rgba(0,229,255,0.8)] animate-pulse" />
          <span className="text-[9px] font-bold text-healthy-500 uppercase tracking-[0.15em] leading-none">
            Live Sync
          </span>
        </div>
      </div>

      <div className="divide-y divide-neutral-800/60 relative z-10 max-h-[450px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600">
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

            let link = log.repo?.url || "#";
            if (isCommit && meta.sha)
              link = `${log.repo?.url}/commit/${meta.sha}`;
            if (isPR && meta.number)
              link = `${log.repo?.url}/pull/${meta.number}`;

            const TypeIcon = isCommit
              ? GitCommit
              : isPR
                ? GitPullRequest
                : Activity;

            return (
              <FadeIn delay={logIdx * 0.04} direction="left" key={log.id}>
                <motion.a
                  href={link}
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
                    className="absolute inset-0 bg-linear-to-r from-healthy-500/5 to-transparent"
                    variants={{ idle: { opacity: 0 }, hover: { opacity: 1 } }}
                    transition={{ duration: 0.2 }}
                  />

                  <div className="flex flex-col gap-1.5 overflow-hidden relative z-10 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <TypeIcon className="w-3.5 h-3.5 text-neutral-500 group-hover:text-healthy-400 transition-colors shrink-0" />
                      <span className="text-[9px] px-2 py-0.5 bg-neutral-800/60 border border-neutral-700/40 text-neutral-500 font-bold rounded tracking-widest uppercase shrink-0 group-hover:border-healthy-500/25 group-hover:text-healthy-400/70 transition-all">
                        {log.repo?.name || "System"}
                      </span>
                      <p className="text-neutral-200 font-medium group-hover:text-neutral-50 transition-colors duration-150 truncate">
                        {log.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono ml-5 group-hover:text-neutral-400 transition-colors">
                      <span className="text-healthy-400/50">
                        {isCommit && meta.sha
                          ? `#${meta.sha.substring(0, 7)}`
                          : isPR && meta.number
                            ? `#${meta.number}`
                            : "SYS_LOG"}
                      </span>
                      <span className="text-neutral-700">·</span>
                      <span>{meta.author || "system"}</span>
                      {meta.action && (
                        <>
                          <span className="text-neutral-700">·</span>
                          <span>{meta.action}</span>
                        </>
                      )}
                      <span className="text-neutral-700">·</span>
                      <span>
                        {formatDistanceToNow(new Date(log.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded-full border shrink-0 relative z-10 ${
                      log.status === "HEALTHY"
                        ? "bg-healthy-500/10 border-healthy-700/50 text-healthy-400 shadow-[inset_0_0_8px_rgba(0,229,255,0.15)]"
                        : log.status === "WARNING"
                          ? "bg-warning-500/10 border-warning-700/50 text-warning-400 shadow-[inset_0_0_8px_rgba(255,215,0,0.15)]"
                          : log.status === "CRITICAL"
                            ? "bg-critical-500/10 border-critical-700/50 text-critical-400 shadow-[inset_0_0_8px_rgba(255,0,123,0.15)]"
                            : "bg-neutral-800/60 border-neutral-700/50 text-neutral-400"
                    }`}
                  >
                    {log.status === "HEALTHY" ? (
                      <Check className="w-3 h-3" />
                    ) : log.status === "WARNING" ? (
                      <AlertCircle className="w-3 h-3" />
                    ) : log.status === "CRITICAL" ? (
                      <Activity className="w-3 h-3" />
                    ) : (
                      <Activity className="w-3 h-3" />
                    )}
                  </div>
                </motion.a>
              </FadeIn>
            );
          })
        ) : (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="relative mb-7">
              <div className="w-16 h-16 rounded-full bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.05)]">
                <Activity className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="absolute inset-0 rounded-full border border-healthy-500/10 scale-[1.3]" />
            </div>
            <p className="text-neutral-100 font-bold uppercase tracking-widest text-sm mb-2">
              No System Activity
            </p>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-8 bg-linear-to-l from-neutral-700/60 to-transparent" />
              <span className="text-healthy-500/25 text-[8px]">◆</span>
              <div className="h-px w-8 bg-linear-to-r from-neutral-700/60 to-transparent" />
            </div>
            <p className="text-neutral-500 text-xs max-w-64 leading-relaxed">
              Connect a GitHub repository to start syncing events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
