import { Activity, GitCommit, GitPullRequest, Check, AlertCircle, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import FadeIn from "@/app/(pages)/repository/components/FadeIn";

// Create a unified Logs type that matches prisma output
type LogWithRepo = {
  id: string;
  type: string;
  message: string;
  status: string;
  createdAt: Date;
  metadata: any;
  repo: { name: string; url: string | null } | null;
};

export default function GlobalActivityFeed({ recentLogs }: { recentLogs: LogWithRepo[] }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 shadow-xl rounded-lg overflow-hidden relative flex flex-col">
      <div className="p-4 px-5 border-b border-neutral-800 flex items-center gap-3 relative z-10 bg-neutral-900">
        <div className="p-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
          <Activity className="w-4 h-4 text-neutral-300" />
        </div>
        <h3 className="text-base font-semibold text-neutral-50 tracking-wide">
          Global Activity Feed
        </h3>
        <div className="ml-auto flex items-center gap-1 text-[10px] font-mono text-neutral-500 bg-neutral-950 px-2 py-1 rounded-md border border-neutral-800">
          <span>LIVE_SYNC</span>
          <span className="w-1.5 h-1.5 rounded-full bg-healthy-500 animate-pulse ml-1" />
        </div>
      </div>

      <div className="divide-y divide-neutral-800 relative z-10 max-h-[450px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600">
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
            
            // Compute link
            let link = log.repo?.url || "#";
            if (isCommit && meta.sha) link = `${log.repo?.url}/commit/${meta.sha}`;
            if (isPR && meta.number) link = `${log.repo?.url}/pull/${meta.number}`;

            return (
              <FadeIn delay={logIdx * 0.05} direction="left" key={log.id}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 py-4 hover:bg-neutral-800 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5 overflow-hidden">
                    <div className="flex items-center gap-2">
                      {isCommit && <GitCommit className="w-4 h-4 text-neutral-500 group-hover:text-healthy-500 transition-colors" />}
                      {isPR && <GitPullRequest className="w-4 h-4 text-neutral-500 group-hover:text-healthy-500 transition-colors" />}
                      <span className="bg-neutral-800 px-1.5 py-0.5 rounded-md text-nowrap text-[10px] font-bold tracking-wider text-neutral-400 border border-neutral-700 uppercase group-hover:border-healthy-500 group-hover:text-healthy-400 transition-colors">
                        {log.repo?.name || "System"}
                      </span>
                      <p className="text-neutral-200 font-medium group-hover:text-healthy-500 transition-colors truncate">
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
                      <Check className="w-3 h-3 drop-shadow-[0_0_3px_rgba(0,229,255,0.8)]" />
                    ) : log.status === "WARNING" ? (
                      <AlertCircle className="w-3 h-3 drop-shadow-[0_0_3px_rgba(255,215,0,0.8)]" />
                    ) : log.status === "CRITICAL" ? (
                      <Activity className="w-3 h-3 drop-shadow-[0_0_3px_rgba(255,0,123,0.8)]" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </div>
                </a>
              </FadeIn>
            );
          })
        ) : (
          <div className="p-10 flex-1 flex flex-col items-center justify-center text-center relative z-10">
            <div className="w-15 h-15 bg-neutral-800 border border-neutral-700 rounded-lg rotate-45 flex items-center justify-center mb-10 shadow-inner">
              <div className="-rotate-45">
                <Activity className="w-6 h-6 text-neutral-300" />
              </div>
            </div>
            <p className="text-neutral-100 font-medium mb-1.5 uppercase tracking-wide text-lg">
              No System Activity
            </p>
            <p className="text-neutral-400 text-xs max-w-100 leading-relaxed">
              Your command center is waiting for signals. Connect a GitHub repository to start syncing events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
