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
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 px-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
            <Settings2 className="w-4 h-4 text-neutral-300" />
          </div>
          <h3 className="text-base font-semibold text-neutral-50 tracking-wide">
            Advanced Configuration
          </h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
        
        {/* GitHub PAT */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-neutral-400" />
            GitHub Personal Access Token
          </label>
          <Input
            type="password"
            name="githubToken"
            defaultValue={settings?.githubToken || ""}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxx"
          />
          <p className="text-xs text-neutral-500">
            Required for active actions (like auto-merging PRs or syncing private repositories).
          </p>
        </div>

        {/* Data Retention */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
            <Database className="w-4 h-4 text-neutral-400" />
            Data Retention Policy
          </label>
          <select
            name="dataRetentionDays"
            defaultValue={settings?.dataRetentionDays?.toString() || "30"}
            className="w-full bg-neutral-900 px-4 py-3 rounded-lg border border-neutral-800 focus:border-healthy-500 outline-none text-neutral-50 transition-all hover:bg-neutral-800 font-mono text-sm appearance-none cursor-pointer"
          >
            <option value="7">Auto-delete logs older than 7 Days</option>
            <option value="30">Auto-delete logs older than 30 Days</option>
            <option value="0">Keep all logs forever (Not recommended)</option>
          </select>
          <p className="text-xs text-neutral-500">
            Helps maintain database performance by clearing stale deployment and system logs.
          </p>
        </div>

        <div className="flex items-center justify-end mt-2 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-4">
            {success && (
              <span className="flex items-center gap-1.5 text-healthy-400 text-sm font-medium animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Saved
              </span>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-neutral-100 cursor-pointer text-neutral-950 px-6 py-2.5 rounded-lg font-bold hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
