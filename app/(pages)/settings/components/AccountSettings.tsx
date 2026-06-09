"use client";

import { useState } from "react";
import { updateAccount } from "@/actions/settings";
import { signOut, signIn } from "next-auth/react";
import { User, LogOut, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/Input";
import { useToast } from "@/components/ToastProvider";
import { GitHubIcon } from "@/app/(auth)/login/page";

interface AccountSettingsProps {
  user: {
    email: string | null;
    isGuest: boolean;
    hasGithubBound: boolean;
  };
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateAccount(formData);
    if (result.error) {
      toast(result.error, "error");
    } else {
      toast("Account settings updated successfully.", "success");
    }
    setLoading(false);
  }

  return (
    <div className="bg-neutral-900/70 border border-neutral-700/40 rounded-lg overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Panel Header */}
      <div className="p-4 px-5 border-b border-neutral-700/40 flex items-center justify-between bg-neutral-800/30 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-healthy-500/10 rounded border border-healthy-500/20">
            <User className="w-4 h-4 text-healthy-400/80" />
          </div>
          <h3 className="text-sm font-bold text-neutral-100 tracking-widest uppercase">
            Account Management
          </h3>
          <div className="w-10 h-px bg-linear-to-r from-neutral-700/60 to-transparent" />
        </div>

        {/* Account type badge */}
        {user.isGuest ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-warning-500/5 border border-warning-500/15 rounded-sm select-none">
            <ShieldAlert className="w-3 h-3 text-warning-400" />
            <span className="text-[9px] font-bold text-warning-400 uppercase tracking-[0.15em] leading-none">
              Guest Account
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-healthy-500/5 border border-healthy-500/15 rounded-sm select-none">
            <div className="w-1 h-1 rounded-full bg-healthy-500 shadow-[0_0_5px_rgba(0,229,255,0.8)] animate-pulse" />
            <span className="text-[9px] font-bold text-healthy-500 uppercase tracking-[0.15em] leading-none">
              Standard Account
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* User avatar + identity */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-neutral-950/50 border border-neutral-700/30">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-healthy-600 to-healthy-400 flex items-center justify-center text-neutral-950 font-black text-base shrink-0 select-none">
            {user.email ? user.email[0].toUpperCase() : "?"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-neutral-200 font-semibold text-sm truncate">
              {user.email || "No email set"}
            </span>
            <span className="text-neutral-500 text-xs">
              {user.isGuest ? "Temporary guest session" : "Standard account"}
            </span>
          </div>
        </div>
        {/* Guest upgrade notice */}
        {user.isGuest && (
          <div className="mb-6 p-4 rounded-lg bg-warning-500/[0.07] border border-warning-500/20 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-warning-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-warning-200 font-semibold text-sm">
                Upgrade your account
              </p>
              <p className="text-warning-500/70 text-xs mt-1 leading-relaxed">
                You are currently using a temporary guest account. To secure
                your data and make it permanent, please provide a valid email
                and password below.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            name="email"
            required
            defaultValue={user.email || ""}
            placeholder="commander@nexus.ops"
          />
          <Input
            type="password"
            name="password"
            placeholder={
              user.isGuest
                ? "Set a strong password..."
                : "Leave blank to keep current password"
            }
            required={user.isGuest}
            minLength={6}
          />

          {/* Connected Accounts Section */}
          <div className="mt-2 p-4 rounded-lg bg-neutral-950/50 border border-neutral-700/30 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-neutral-800/60 text-neutral-400 group-hover:text-neutral-200 transition-colors">
                <GitHubIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-200 font-semibold text-sm">
                  GitHub Account
                </span>
                <span className="text-neutral-500 text-xs">
                  {user.hasGithubBound
                    ? "Your account is linked to GitHub."
                    : "Link your GitHub account to enable OAuth login."}
                </span>
              </div>
            </div>
            {user.hasGithubBound ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-healthy-500/10 border border-healthy-500/20 text-healthy-400 select-none">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Bound
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => signIn("github")}
                className="px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-neutral-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Bind Account
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-2 pt-4 border-t border-neutral-700/40">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 text-xs px-4 py-2.5 rounded border border-neutral-700/50 text-critical-400/80 hover:text-critical-400 hover:border-critical-500/30 hover:bg-critical-500/5 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-linear-to-r from-healthy-600 to-healthy-500 cursor-pointer text-neutral-950 px-6 py-2.5 rounded-lg font-bold hover:from-healthy-500 hover:to-healthy-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-center text-sm"
            >
              {loading ? "Updating..." : "Save Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
