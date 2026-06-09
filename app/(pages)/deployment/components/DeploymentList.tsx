"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Globe,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Server,
  Loader2,
  GitBranch,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import FadeIn from "@/app/(pages)/repository/components/FadeIn";
import { getMoreDeployments } from "@/actions/logs";
import { motion } from "motion/react";

type DeploymentLog = {
  id: string;
  type: string;
  message: string;
  status: string;
  createdAt: Date;
  metadata: Record<string, unknown>;
  repo: { name: string; url: string | null } | null;
  repoId: string | null;
};

type Repo = {
  id: string;
  name: string;
};

export default function DeploymentList({
  initialDeployments,
  repos,
}: {
  initialDeployments: DeploymentLog[];
  repos: Repo[];
}) {
  const [selectedRepo, setSelectedRepo] = useState("all");
  const [deployments, setDeployments] =
    useState<DeploymentLog[]>(initialDeployments);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When repo filter changes, reset deployments and fetch the first page for that repo
    const fetchFiltered = async () => {
      setLoadingMore(true);
      const { data, error } = await getMoreDeployments(0, 20, selectedRepo);
      if (!error && data) {
        setDeployments(data as unknown as DeploymentLog[]);
        setHasMore(data.length === 20);
      } else {
        setDeployments([]);
        setHasMore(false);
      }
      setLoadingMore(false);
    };

    if (selectedRepo === "all") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeployments(initialDeployments);
      setHasMore(initialDeployments.length === 20);
    } else {
      fetchFiltered();
    }
  }, [selectedRepo, initialDeployments]);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    const { data, error } = await getMoreDeployments(
      deployments.length,
      20,
      selectedRepo,
    );
    if (!error && data) {
      if (data.length < 20) {
        setHasMore(false);
      }
      setDeployments((prev) => [...prev, ...(data as unknown as DeploymentLog[])]);
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  }, [deployments.length, selectedRepo]);

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

  if (deployments.length === 0 && selectedRepo === "all") {
    return (
      <div className="flex flex-col items-center justify-center p-12 flex-1 border border-neutral-800/60 rounded-lg bg-neutral-900/50 relative overflow-hidden group">
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
            <Server className="w-8 h-8 text-neutral-400 group-hover:text-healthy-400 transition-colors duration-500" />
          </div>
          <div className="absolute inset-0 rounded-full border border-healthy-500/10 scale-[1.3] group-hover:border-healthy-500/20 transition-all duration-500" />
          <div className="absolute inset-0 rounded-full border border-healthy-500/5 scale-[1.65] group-hover:border-healthy-500/10 transition-all duration-700" />
        </div>

        <h3 className="text-xl font-bold text-neutral-100 mb-2 relative z-10 tracking-widest uppercase">
          No Deployments Yet
        </h3>
        <div className="flex items-center gap-2 mb-3 z-10">
          <div className="h-px w-10 bg-linear-to-l from-neutral-700/60 to-transparent" />
          <span className="text-healthy-500/25 text-[8px]">◆</span>
          <div className="h-px w-10 bg-linear-to-r from-neutral-700/60 to-transparent" />
        </div>
        <p className="text-neutral-500 text-sm max-w-md text-center leading-relaxed relative z-10">
          No deployment events received from GitHub. Make sure your CI/CD
          platform (Vercel, Netlify, etc.) is linked to your repository and
          deployment webhooks are enabled.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/70 border border-neutral-700/40 shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-lg overflow-hidden flex flex-col relative">
      {/* Panel Header */}
      <div className="p-4 px-5 border-b border-neutral-700/40 flex items-center justify-between bg-neutral-800/30 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-healthy-500/10 rounded border border-healthy-500/20">
            <Globe className="w-4 h-4 text-healthy-400/80" />
          </div>
          <h3 className="text-sm font-bold text-neutral-100 tracking-widest uppercase">
            Global Deployment History
          </h3>
          <div className="flex-1 h-px bg-linear-to-r from-neutral-700/60 to-transparent ml-1" />
        </div>

        {/* Repo Switcher */}
        <div className="group flex items-center gap-2 relative">
          <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-healthy-400 transition-colors">
            <GitBranch className="w-3 h-3" />
          </div>
          <select
            aria-label="Select repository"
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="pl-7 pr-7 py-1.5 bg-neutral-900/80 border border-neutral-700/50 rounded text-[11px] font-medium text-neutral-400 focus:outline-none focus:text-neutral-100 focus:bg-healthy-500/5 focus:border-healthy-500/40 appearance-none cursor-pointer hover:text-neutral-200 hover:border-neutral-600 transition-all tracking-wider"
          >
            <option value="all">All Repositories</option>
            {repos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
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

      <div className="divide-y divide-neutral-800/60 relative z-10">
        {deployments.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <p className="text-neutral-500 text-sm">
              No deployments found for this repository.
            </p>
          </div>
        ) : (
          deployments.map((dpl, idx) => {
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

            const MotionWrapper = meta.url ? motion.a : motion.div;

            return (
              <FadeIn
                delay={idx < 20 ? idx * 0.05 : 0}
                direction="left"
                key={dpl.id}
              >
                <MotionWrapper
                  href={meta.url || undefined}
                  target={meta.url ? "_blank" : undefined}
                  rel={meta.url ? "noopener noreferrer" : undefined}
                  className="group relative p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer overflow-hidden"
                  initial="idle"
                  whileHover="hover"
                >
                  {/* Left sliding accent bar (HSR Style) */}
                  <motion.div
                    className={`absolute left-0 top-0 bottom-0 w-0.5 ${
                      isBuilding
                        ? "bg-linear-to-b from-warning-500/0 via-warning-500 to-warning-500/0"
                        : isError
                          ? "bg-linear-to-b from-critical-500/0 via-critical-500 to-critical-500/0"
                          : "bg-linear-to-b from-healthy-500/0 via-healthy-500 to-healthy-500/0"
                    }`}
                    variants={{
                      idle: { scaleY: 0, opacity: 0 },
                      hover: { scaleY: 1, opacity: 1 },
                    }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  />

                  {/* Hover background gradient (HSR Style) */}
                  <motion.div
                    className={`absolute inset-0 ${
                      isBuilding
                        ? "bg-linear-to-r from-warning-500/6 to-transparent"
                        : isError
                          ? "bg-linear-to-r from-critical-500/6 to-transparent"
                          : "bg-linear-to-r from-healthy-500/6 to-transparent"
                    }`}
                    variants={{
                      idle: { opacity: 0 },
                      hover: { opacity: 1 },
                    }}
                    transition={{ duration: 0.2 }}
                  />

                  <div className="flex items-start sm:items-center gap-5 relative z-10">
                    {/* Status icon */}
                    <div className="mt-0.5 sm:mt-0 shrink-0">
                      {isReady ? (
                        <CheckCircle2 className="w-5 h-5 text-healthy-400 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]" />
                      ) : isBuilding ? (
                        <Clock className="w-5 h-5 text-warning-400 drop-shadow-[0_0_5px_rgba(255,215,0,0.5)] animate-pulse" />
                      ) : (
                        <XCircle className="w-5 h-5 text-critical-400 drop-shadow-[0_0_5px_rgba(255,0,123,0.5)]" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Environment label */}
                        <span
                          className={`text-sm font-bold tracking-wide ${
                            meta.environment === "Production"
                              ? "text-neutral-100 group-hover:text-white"
                              : "text-neutral-300 group-hover:text-neutral-100"
                          } transition-colors`}
                        >
                          {meta.environment || "Preview"}
                        </span>

                        {/* Branch badge */}
                        {meta.branch && (
                          <span className="text-[10px] px-2 py-0.5 bg-neutral-900/80 border border-neutral-700/50 text-neutral-400 font-mono rounded tracking-wider">
                            {meta.branch}
                          </span>
                        )}

                        {/* Repo name badge */}
                        <span className="text-[9px] px-2 py-0.5 bg-neutral-800/60 border border-neutral-700/40 text-neutral-500 font-bold rounded tracking-widest uppercase group-hover:border-healthy-500/25 group-hover:text-healthy-400/70 transition-colors duration-300">
                          {dpl.repo?.name || "System"}
                        </span>
                      </div>

                      <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors line-clamp-1">
                        {dpl.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:pl-0 pl-10 relative z-10 shrink-0">
                    <div className="flex flex-col sm:items-end gap-1">
                      <span className="text-xs font-mono text-neutral-400 whitespace-nowrap group-hover:text-neutral-300 transition-colors">
                        {formatDistanceToNow(new Date(dpl.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-600 bg-neutral-800/60 px-2 py-0.5 rounded border border-neutral-700/30 group-hover:border-neutral-600/50 transition-colors">
                        {meta.sha
                          ? meta.sha.substring(0, 7)
                          : dpl.id.substring(0, 7)}
                      </span>
                    </div>

                    <div
                      className={`p-2 rounded border transition-all duration-200 ${
                        meta.url
                          ? "border-neutral-700/40 text-neutral-500 group-hover:border-healthy-500/30 group-hover:bg-healthy-500/5 group-hover:text-healthy-400"
                          : "border-neutral-800/40 text-neutral-700"
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </MotionWrapper>
              </FadeIn>
            );
          })
        )}
      </div>

      {hasMore && (
        <div
          ref={observerRef}
          className="p-8 flex items-center justify-center relative z-10 border-t border-neutral-800/60"
        >
          {loadingMore ? (
            <div className="flex items-center gap-2 text-healthy-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs tracking-widest uppercase font-bold">
                Syncing Records...
              </span>
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-neutral-800" />
          )}
        </div>
      )}
    </div>
  );
}
