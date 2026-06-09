import { GitPullRequest } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import FadeIn from "@/app/(pages)/repository/components/FadeIn";

type LogWithRepo = {
  id: string;
  type: string;
  message: string;
  status: string;
  createdAt: Date;
  metadata: any;
  repo: { name: string; url: string | null } | null;
};

export default function PendingActions({ recentPRs }: { recentPRs: LogWithRepo[] }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 shadow-xl rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 px-5 border-b border-neutral-800 flex items-center gap-3 bg-neutral-900">
        <div className="p-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
          <GitPullRequest className="w-4 h-4 text-neutral-300" />
        </div>
        <h3 className="text-base font-semibold text-neutral-50 tracking-wide">
          Pending Actions
        </h3>
      </div>
      
      <div className="flex-1 divide-y divide-neutral-800 overflow-y-auto max-h-[600px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
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
            
            const link = pr.repo?.url && meta.prNumber ? `${pr.repo.url}/pull/${meta.prNumber}` : "#";

            return (
              <FadeIn delay={idx * 0.05} direction="left" key={pr.id}>
                <a 
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 flex flex-col gap-2 hover:bg-neutral-800 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-nowrap text-neutral-400 border border-neutral-700 uppercase group-hover:text-healthy-400 group-hover:border-healthy-500/50 transition-colors">
                      {pr.repo?.name}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono ml-auto whitespace-nowrap">
                      {formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-neutral-200 group-hover:text-healthy-500 transition-colors line-clamp-2">
                      {meta.title || pr.message}
                    </p>
                    {meta.description && (
                      <p className="text-neutral-400 text-xs mt-1.5 line-clamp-2">
                        {meta.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-neutral-500 font-mono">#{meta.prNumber}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-warning-400 animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
                      <span className="text-xs font-medium text-warning-400">Needs Review</span>
                    </div>
                  </div>
                </a>
              </FadeIn>
            )
          })
        ) : (
          <div className="p-10 flex-1 flex flex-col items-center justify-center text-center relative z-10">
            <div className="w-15 h-15 bg-neutral-800 border border-neutral-700 rounded-lg rotate-45 flex items-center justify-center mb-10 shadow-inner">
              <div className="-rotate-45">
                <GitPullRequest className="w-6 h-6 text-neutral-300" />
              </div>
            </div>
            <p className="text-neutral-100 font-medium mb-1.5 uppercase tracking-wide text-lg">
              No Pending Actions
            </p>
            <p className="text-neutral-400 text-xs max-w-100 leading-relaxed">
              All caught up! There are no pending pull requests across your repositories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
