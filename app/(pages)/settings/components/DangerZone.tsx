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
      <div className="bg-critical-500/5 border border-critical-500/30 rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 px-5 border-b border-critical-500/20 flex items-center gap-3 bg-critical-500/10">
          <div className="p-1.5 bg-critical-500/20 rounded-lg">
            <TriangleAlert className="w-4 h-4 text-critical-400" />
          </div>
          <h3 className="text-base font-bold text-critical-400 tracking-wide">
            Danger Zone
          </h3>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
            <div className="flex flex-col">
              <span className="text-neutral-200 font-semibold text-sm">Clear All Logs</span>
              <span className="text-neutral-500 text-xs mt-1">
                Permanently delete all historical logs, pull requests, and deployment records across all repositories.
              </span>
            </div>
            <button
              onClick={() => setShowLogsModal(true)}
              className="px-4 py-2 bg-neutral-800 hover:bg-critical-500/20 text-neutral-300 hover:text-critical-400 border border-neutral-700 hover:border-critical-500/50 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Clear Logs
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
            <div className="flex flex-col">
              <span className="text-neutral-200 font-semibold text-sm">Delete Account</span>
              <span className="text-neutral-500 text-xs mt-1">
                Permanently wipe your account, repositories, settings, and logs. This action is irreversible.
              </span>
            </div>
            <button
              onClick={() => setShowAccountModal(true)}
              className="px-4 py-2 bg-critical-500/10 hover:bg-critical-500 text-critical-500 hover:text-white border border-critical-500/30 hover:border-critical-500 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Skull className="w-4 h-4" />
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
        description={<>This will permanently delete all activity logs from the database. To confirm, type <strong className="text-critical-400 select-none">CLEAR</strong> below.</>}
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
        description={<>This will instantly obliterate your entire account, including all repositories and settings. Type <strong className="text-critical-400 select-none">DELETE</strong> below to confirm.</>}
        requireInput="DELETE"
        confirmText="Terminate Account"
        variant="danger"
        isLoading={loading}
      />
    </>
  );
}
