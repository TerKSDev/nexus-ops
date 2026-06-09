import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Server,
  Plus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import FadeIn from "@/app/(pages)/repository/components/FadeIn";

export default async function VercelPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch DEPLOYMENT logs across all repos belonging to the user
  const deployments = await prisma.logs.findMany({
    where: {
      type: "DEPLOYMENT",
      repo: { userId: session.user.id },
    },
    orderBy: { createdAt: "desc" },
    include: { repo: true },
  });

  return (
    <div className="p-8 px-12 w-full max-w-7xl mx-auto flex flex-1 flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-1 bg-linear-to-b from-healthy-500 to-transparent" />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-neutral-50 to-neutral-400 tracking-tight uppercase">
              Deployments
            </h1>
            <p className="text-neutral-400 tracking-wide text-base">
              Track your application builds and deployments via GitHub Webhooks.
            </p>
          </div>
        </div>

        {/* Redirect to Repository to add a new tracking target instead of Deploy button */}
        <Link
          href="/repository"
          className="flex items-center gap-2 px-6 py-2.5 bg-neutral-100 text-neutral-950 font-bold rounded-lg hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Add Repository
        </Link>
      </div>

      <div className="flex flex-col gap-8 flex-1">
        {deployments.length > 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 shadow-xl rounded-lg overflow-hidden flex flex-col relative">
            <div className="p-4 px-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
                  <Globe className="w-4 h-4 text-neutral-300" />
                </div>
                <h3 className="text-base font-semibold text-neutral-50 tracking-wide">
                  Global Deployment History
                </h3>
              </div>
            </div>

            <div className="divide-y divide-neutral-800 relative z-10">
              {deployments.map((dpl, idx) => {
                const meta =
                  (dpl.metadata as {
                    state?: string;
                    environment?: string;
                    url?: string;
                    sha?: string;
                    branch?: string;
                    author?: string;
                    time?: string;
                  }) || {};

                const isBuilding = dpl.status === "WARNING";
                const isError = dpl.status === "CRITICAL";
                const isReady = dpl.status === "HEALTHY";

                return (
                  <FadeIn delay={idx * 0.05} direction="left" key={dpl.id}>
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-800/40 transition-all duration-200 group relative">
                      {/* Status Side Border Indicator */}
                      {isBuilding && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-warning-400 shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
                      )}
                      {isError && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-critical-500 shadow-[0_0_10px_rgba(255,0,123,0.8)]" />
                      )}

                      <div className="flex items-start sm:items-center gap-5">
                        <div className="mt-1 sm:mt-0 relative">
                          {isReady ? (
                            <CheckCircle2 className="w-6 h-6 text-healthy-400 drop-shadow-[0_0_5px_rgba(0,229,255,0.6)]" />
                          ) : isBuilding ? (
                            <Clock className="w-6 h-6 text-warning-400 drop-shadow-[0_0_5px_rgba(255,215,0,0.6)] animate-pulse" />
                          ) : (
                            <XCircle className="w-6 h-6 text-critical-500 drop-shadow-[0_0_5px_rgba(255,0,123,0.6)]" />
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-bold tracking-wide ${meta.environment === "Production" ? "text-neutral-100" : "text-neutral-400"}`}
                            >
                              {meta.environment || "Preview"}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded border border-neutral-700 bg-neutral-800 text-neutral-300 font-mono">
                              {meta.branch || "unknown"}
                            </span>
                            <span className="bg-neutral-800 px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider text-neutral-400 border border-neutral-700 uppercase">
                              {dpl.repo?.name || "System"}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors line-clamp-1">
                            {dpl.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8 sm:pl-0 pl-11">
                        <div className="flex flex-col sm:items-end gap-1">
                          <span className="text-sm font-mono text-neutral-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(dpl.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                          <span className="text-xs font-mono text-neutral-600 bg-neutral-800/50 px-2 rounded">
                            {meta.sha || dpl.id.substring(0, 8)}
                          </span>
                        </div>

                        <a
                          href={meta.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-lg border border-transparent hover:border-neutral-700 hover:bg-neutral-800/80 text-neutral-500 hover:text-healthy-400 transition-all duration-300 shadow-sm cursor-pointer"
                          onClick={(e) => !meta.url && e.preventDefault()}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 flex-1 border-2 border-dashed border-neutral-800 rounded-lg bg-neutral-900 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-healthy-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-healthy-500/10 transition-colors duration-700 animate-pulse" />
            <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center mb-8 shadow-2xl relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <Server className="w-8 h-8 text-neutral-500 group-hover:text-healthy-400 transition-colors duration-500" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-100 mb-1.5 relative z-10 tracking-wide">
              No Deployments Yet
            </h3>
            <p className="text-neutral-400 text-sm max-w-150 text-center leading-relaxed relative z-10">
              {
                "We haven't received any deployment status events from GitHub. Make sure your CI/CD platform (Vercel, Netlify, etc.) is linked to your GitHub repository and deployment webhooks are enabled."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
