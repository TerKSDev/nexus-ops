"use client";

import { useState } from "react";
import { deleteAllLogs, deleteAccount } from "@/actions/settings";
import { TriangleAlert, Trash2, Skull } from "lucide-react";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useToast } from "@/components/ToastProvider";

export default function DangerZone() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  async function handleClearLogs() {
    setLoading(true);
    const res = await deleteAllLogs();
    setLoading(false);
    setShowLogsModal(false);
    if (res.error) {
      toast(res.error, "error");
    } else {
      toast("All logs have been permanently deleted.", "success");
    }
  }

  async function handleDeleteAccount() {
    setLoading(true);
    await deleteAccount();
    window.location.href = "/login";
  }

  return (
    <>
      <div className="bg-critical-500/4 border border-critical-500/20 rounded-lg overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        {/* Panel Header — red accent */}
        <div className="p-4 px-5 border-b border-critical-500/15 flex items-center gap-3 bg-critical-500/6 relative z-10">
          <div className="p-1.5 bg-critical-500/15 rounded border border-critical-500/20">
            <TriangleAlert className="w-4 h-4 text-critical-400" />
          </div>
          <h3 className="text-sm font-bold text-critical-400 tracking-widest uppercase">
            Danger Zone
          </h3>
          <div className="flex-1 h-px bg-linear-to-r from-critical-500/20 to-transparent ml-1" />
        </div>

        <div className="p-5 flex flex-col gap-3">
          {/* Clear Logs row */}
          <div className="flex items-center justify-between p-4 bg-neutral-900/60 border border-neutral-700/30 rounded-lg">
            <div className="flex flex-col gap-0.5">
              <span className="text-neutral-200 font-semibold text-sm">
                Clear All Logs
              </span>
              <span className="text-neutral-500 text-xs leading-relaxed max-w-md">
                Permanently delete all historical logs, pull requests, and
                deployment records across all repositories.
              </span>
            </div>
            <button
              onClick={() => setShowLogsModal(true)}
              className="ml-6 shrink-0 flex items-center gap-2 px-4 py-2 bg-neutral-800/70 hover:bg-critical-500/10 text-neutral-400 hover:text-critical-400 border border-neutral-700/50 hover:border-critical-500/30 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer text-center"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Logs
            </button>
          </div>

          {/* Delete Account row */}
          <div className="flex items-center justify-between p-4 bg-neutral-900/60 border border-neutral-700/30 rounded-lg">
            <div className="flex flex-col gap-0.5">
              <span className="text-neutral-200 font-semibold text-sm">
                Delete Account
              </span>
              <span className="text-neutral-500 text-xs leading-relaxed max-w-md">
                Permanently wipe your account, repositories, settings, and logs.
                This action is irreversible.
              </span>
            </div>
            <button
              onClick={() => setShowAccountModal(true)}
              className="ml-6 shrink-0 flex items-center gap-2 px-4 py-2 bg-critical-500/10 hover:bg-critical-500/20 text-critical-400 border border-critical-500/25 hover:border-critical-500/50 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer text-center"
            >
              <Skull className="w-3.5 h-3.5" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        onConfirm={handleClearLogs}
        title="Clear All System Logs"
        description={
          <>
            This will permanently delete all activity logs from the database. To
            confirm, type{" "}
            <strong className="text-critical-400 select-none">CLEAR</strong>{" "}
            below.
          </>
        }
        requireInput="CLEAR"
        confirmText="Yes, clear all logs"
        variant="danger"
        isLoading={loading}
      />

      <ConfirmModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Nexus Ops Account"
        description={
          <>
            This will instantly obliterate your entire account, including all
            repositories and settings. Type{" "}
            <strong className="text-critical-400 select-none">DELETE</strong>{" "}
            below to confirm.
          </>
        }
        requireInput="DELETE"
        confirmText="Terminate Account"
        variant="danger"
        isLoading={loading}
      />
    </>
  );
}
