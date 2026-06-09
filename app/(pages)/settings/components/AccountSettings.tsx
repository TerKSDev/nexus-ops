"use client";

import { useState } from "react";
import { updateAccount } from "@/actions/settings";
import { signOut } from "next-auth/react";
import { User, LogOut, ShieldAlert } from "lucide-react";
import { Input } from "@/components/Input";
import { useToast } from "@/components/ToastProvider";

interface AccountSettingsProps {
  user: {
    email: string | null;
    isGuest: boolean;
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
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 px-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
            <User className="w-4 h-4 text-neutral-300" />
          </div>
          <h3 className="text-base font-semibold text-neutral-50 tracking-wide">
            Account Management
          </h3>
        </div>
        {user.isGuest ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-warning-500/10 border border-warning-500/20 rounded-full select-none">
            <ShieldAlert className="w-3.5 h-3.5 text-warning-500" />
            <span className="text-[10px] font-bold text-warning-500 uppercase tracking-wider leading-none">
              Guest Account
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-healthy-500/10 border border-healthy-500/20 rounded-full select-none">
            <div className="w-1.5 h-1.5 rounded-full bg-healthy-500 shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
            <span className="text-[10px] font-bold text-healthy-500 uppercase tracking-wider leading-none">
              Standard Account
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        {user.isGuest && (
          <div className="mb-6 p-4 rounded-lg bg-warning-500/10 border border-warning-500/30 flex items-start gap-3 shadow-[inset_0_0_10px_rgba(255,215,0,0.1)]">
            <ShieldAlert className="w-5 h-5 text-warning-500 mt-0.5" />
            <div>
              <p className="text-warning-100 font-medium text-sm">
                Upgrade your account
              </p>
              <p className="text-warning-500/80 text-xs mt-1 leading-relaxed">
                You are currently using a temporary guest account. To secure
                your data and make it permanent, please provide a valid email
                and password below.
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="email"
                name="email"
                required
                defaultValue={user.email || ""}
                placeholder="commander@nexus.ops"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
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
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs px-4 py-2.5 bg-neutral-900 rounded-md border border-neutral-800 transition-colors duration-300 hover:bg-neutral-800 text-critical-400 flex items-center gap-2"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-healthy-500 cursor-pointer text-neutral-950 px-6 py-2.5 rounded-lg font-bold hover:bg-healthy-400 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
