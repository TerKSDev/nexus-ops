"use client";

import { useState } from "react";
import { updateAdvancedSettings } from "@/actions/settings";
import { Settings2, GitBranch, Database, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/Input";
import { useToast } from "@/components/ToastProvider";

interface AdvancedSettingsProps {
  settings: {
    githubToken: string | null;
    dataRetentionDays: number;
  } | null;
}

export default function AdvancedSettings({ settings }: AdvancedSettingsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    await updateAdvancedSettings(formData);
    setSuccess(true);
    setLoading(false);
    toast("Advanced settings saved.", "success");
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="bg-neutral-900/70 border border-neutral-700/40 rounded-lg overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Panel Header */}
      <div className="p-4 px-5 border-b border-neutral-700/40 flex items-center gap-3 bg-neutral-800/30 relative z-10">
        <div className="p-1.5 bg-healthy-500/10 rounded border border-healthy-500/20">
          <Settings2 className="w-4 h-4 text-healthy-400/80" />
        </div>
        <h3 className="text-sm font-bold text-neutral-100 tracking-widest uppercase">
          Advanced Configuration
        </h3>
        <div className="flex-1 h-px bg-linear-to-r from-neutral-700/60 to-transparent ml-1" />
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
        {/* GitHub PAT */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5" />
            GitHub Personal Access Token
          </label>
          <Input
            type="password"
            name="githubToken"
            defaultValue={settings?.githubToken || ""}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxx"
          />
          <p className="text-xs text-neutral-600 leading-relaxed">
            Required for active actions (like auto-merging PRs or syncing
            private repositories).
          </p>
        </div>

        {/* Data Retention */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <Database className="w-3.5 h-3.5" />
            Data Retention Policy
          </label>
          <div className="relative group">
            <select
              name="dataRetentionDays"
              defaultValue={settings?.dataRetentionDays?.toString() || "30"}
              className="w-full bg-neutral-900/80 px-4 py-2.5 rounded-lg border border-neutral-700/50 focus:border-healthy-500/60 focus:shadow-[0_0_0_2px_rgba(0,229,255,0.08)] outline-none text-neutral-100 transition-all hover:bg-neutral-800/60 hover:border-neutral-600/60 font-mono text-sm appearance-none cursor-pointer"
            >
              <option value="7">Auto-delete logs older than 7 Days</option>
              <option value="30">Auto-delete logs older than 30 Days</option>
              <option value="0">Keep all logs forever (Not recommended)</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              <svg
                className="w-3 h-3"
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
          <p className="text-xs text-neutral-600 leading-relaxed">
            Helps maintain database performance by clearing stale deployment and
            system logs.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-neutral-700/40">
          <div className="flex items-center gap-4">
            {success && (
              <span className="flex items-center gap-1.5 text-healthy-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Saved
              </span>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-linear-to-r from-healthy-600 to-healthy-500 cursor-pointer text-neutral-950 px-6 py-2.5 rounded-lg font-bold hover:from-healthy-500 hover:to-healthy-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-center text-sm"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
