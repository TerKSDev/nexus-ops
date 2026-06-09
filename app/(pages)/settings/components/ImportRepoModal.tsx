"use client";

import { useState, useEffect } from "react";
import { fetchGithubRepos } from "@/actions/github";
import { importRepos } from "@/actions/repository";
import { motion, AnimatePresence } from "motion/react";
import { CloudDownload, X, Loader2, Search, Check } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

type GithubRepo = {
  name: string;
  full_name: string;
  html_url: string;
  private: boolean;
  updated_at: string;
};

export default function ImportRepoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const loadRepos = async () => {
    setLoading(true);
    setError(null);
    const res = await fetchGithubRepos();
    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setRepos(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadRepos();
    } else {
      setRepos([]);
      setSelected(new Set());
      setSearch("");
      setError(null);
    }
  }, [isOpen]);

  const filteredRepos = repos.filter((r) =>
    r.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (fullName: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(fullName)) next.delete(fullName);
      else next.add(fullName);
      return next;
    });
  };

  const handleImport = async () => {
    if (selected.size === 0) return;
    setImporting(true);

    const reposToImport = repos
      .filter((r) => selected.has(r.full_name))
      .map((r) => ({ full_name: r.full_name, html_url: r.html_url }));

    const baseUrl = window.location.origin;
    const res = await importRepos(reposToImport, baseUrl);

    setImporting(false);

    if (res.error) {
      toast(res.error, "error");
    } else {
      let msg = `Successfully imported ${res.count} repositories.`;
      if (res.webhookFailedCount && res.webhookFailedCount > 0) {
        msg += ` However, ${res.webhookFailedCount} webhooks failed to auto-configure (missing permissions). Please configure them manually.`;
        toast(msg, "error");
      } else {
        toast(msg, "success");
      }
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-neutral-900 border border-neutral-700/50 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-[101] flex flex-col max-h-[70vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 px-5 border-b border-neutral-800 bg-neutral-950/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-healthy-500/10 rounded-md border border-healthy-500/20">
                  <CloudDownload className="w-5 h-5 text-healthy-400" />
                </div>
                <h2 className="text-sm font-bold text-neutral-100 tracking-widest uppercase">
                  Import from GitHub
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 text-healthy-500 animate-spin mb-4" />
                  <p className="text-neutral-400 text-sm tracking-widest uppercase">
                    Fetching Repositories...
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="p-3 bg-critical-500/10 rounded-full mb-4">
                    <X className="w-8 h-8 text-critical-400" />
                  </div>
                  <p className="text-neutral-200 mb-2">{error}</p>
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <p className="text-neutral-500 text-xs max-w-sm">
                      Please configure your GitHub Personal Access Token in the Settings panel to access repositories.
                    </p>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo,admin:repo_hook&description=Nexus%20Ops%20Integration"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] flex items-center gap-1.5 text-healthy-500 hover:text-healthy-400 font-bold tracking-wide transition-colors bg-healthy-500/10 px-2.5 py-1.5 rounded border border-healthy-500/20 w-fit mt-2"
                    >
                      👉 Auto-Generate Token
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b border-neutral-800 shrink-0 bg-neutral-900">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Search repositories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-950/50 border border-neutral-800 rounded-md py-2 pl-9 pr-4 text-sm text-neutral-200 focus:outline-none focus:border-healthy-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredRepos.length > 0 ? (
                      filteredRepos.map((repo) => {
                        const isSelected = selected.has(repo.full_name);
                        return (
                          <div
                            key={repo.full_name}
                            onClick={() => toggleSelect(repo.full_name)}
                            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer border transition-all ${
                              isSelected
                                ? "bg-healthy-500/10 border-healthy-500/30"
                                : "bg-transparent border-transparent hover:bg-neutral-800/50"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-sm flex items-center justify-center border transition-colors ${
                                isSelected
                                  ? "bg-healthy-500 border-healthy-500"
                                  : "bg-neutral-800 border-neutral-600"
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 text-neutral-950" />}
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden">
                              <span className="text-sm font-medium text-neutral-200 truncate">
                                {repo.full_name}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                {repo.private ? (
                                  <span className="text-[10px] bg-warning-500/10 text-warning-400 px-1.5 py-0.5 rounded border border-warning-500/20">
                                    Private
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-700">
                                    Public
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-neutral-500 text-sm">
                        No repositories found.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/50 flex justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={selected.size === 0 || importing || loading || !!error}
                className="px-4 py-2 bg-healthy-500 hover:bg-healthy-400 disabled:opacity-50 disabled:hover:bg-healthy-500 text-neutral-950 text-sm font-bold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2"
              >
                {importing && <Loader2 className="w-4 h-4 animate-spin" />}
                Import Selected ({selected.size})
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
