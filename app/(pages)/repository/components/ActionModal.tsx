"use client";

import { useState } from "react";
import {
  Trash2,
  RefreshCw,
  KeyRound,
  Check,
  Copy,
  Eraser,
  PauseCircle,
  PlayCircle,
  Edit3,
  X,
  Waypoints,
  Download,
} from "lucide-react";
import { motion } from "motion/react";
import {
  deleteRepo,
  regenerateSecret,
  clearRepoLogs,
  toggleRepoTracking,
  updateRepo,
} from "@/actions/repository";
import { syncRepoHistory } from "@/actions/github";
import { Input } from "@/components/Input";

interface ActionModalProps {
  repoId: string;
  repoName: string;
  url: string;
  isActive: boolean;
  isOpen: boolean;
  onClose: () => void;
}

/** Shared corner bracket decoration for HSR-style modals */
function CornerBrackets() {
  return (
    <>
      <div className="absolute top-3 left-3 w-5 h-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-healthy-500/50 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-linear-to-b from-healthy-500/50 to-transparent" />
      </div>
      <div className="absolute top-3 right-3 w-5 h-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-px bg-linear-to-l from-healthy-500/50 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-px bg-linear-to-b from-healthy-500/50 to-transparent" />
      </div>
      <div className="absolute bottom-3 left-3 w-5 h-5 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-healthy-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 h-full w-px bg-linear-to-t from-healthy-500/50 to-transparent" />
      </div>
      <div className="absolute bottom-3 right-3 w-5 h-5 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-px bg-linear-to-l from-healthy-500/50 to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-linear-to-t from-healthy-500/50 to-transparent" />
      </div>
    </>
  );
}

/** Shared modal panel wrapper with HSR entry animation */
function ModalPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-neutral-900/95 border border-neutral-700/50 p-10 rounded-lg max-w-md w-full relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,229,255,0.04)]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-healthy-500/4 rounded-full blur-[60px] pointer-events-none -mt-12 -mr-12" />
        <CornerBrackets />
        {children}
      </motion.div>
    </div>
  );
}

export default function ActionModal({
  repoId,
  repoName,
  url,
  isActive,
  isOpen,
  onClose,
}: ActionModalProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const [isToggling, setIsToggling] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(repoName);
  const [editUrl, setEditUrl] = useState(url);
  const [isSaving, setIsSaving] = useState(false);

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success?: boolean; count?: number; error?: string } | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    const result = await syncRepoHistory(repoId);
    setSyncResult(result as any);
    setIsSyncing(false);
  };

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }
    setIsDeleting(true);
    await deleteRepo(repoId);
    onClose();
  };

  const handleClearLogs = async () => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      return;
    }
    setIsClearing(true);
    await clearRepoLogs(repoId);
    setIsConfirmingClear(false);
    setIsClearing(false);
  };

  const handleToggleTracking = async () => {
    setIsToggling(true);
    await toggleRepoTracking(repoId, isActive);
    setIsToggling(false);
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    await updateRepo(repoId, editName, editUrl);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const result = await regenerateSecret(repoId);
    if (result.success && result.secret) {
      setNewSecret(result.secret);
    }
    setIsRegenerating(false);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => {
      setCopied(null);
    }, 5000);
  };

  // 新 Secret 的一次性顯示畫面
  if (newSecret) {
    const payloadUrl = "https://nexus-ops-roan.vercel.app/api/webhook/github";

    return (
      <ModalPanel>
        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-neutral-800/80 border border-healthy-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.1)]">
              <KeyRound className="w-8 h-8 text-healthy-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
            </div>
            <div className="absolute inset-0 rounded-full border border-healthy-500/10 scale-[1.3]" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-50 mb-2 tracking-wide">
            Secret Regenerated
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Please save your new Webhook Secret now. For security reasons,{" "}
            <strong className="text-warning-400 font-semibold">
              it will never be shown again
            </strong>
            .
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] px-px font-medium text-neutral-400 tracking-wider uppercase">
              Payload URL
            </span>
            <div
              onClick={() => handleCopy(payloadUrl, "url")}
              className="bg-neutral-950/80 hover:bg-neutral-800/60 group cursor-pointer p-4 py-3 rounded-lg border border-neutral-700/40 hover:border-neutral-600/60 transition-all relative z-10 font-mono flex justify-between items-center gap-4"
            >
              <span className="break-all select-all text-xs text-neutral-300">
                {payloadUrl}
              </span>
              {copied === "url" ? (
                <Check className="w-4 h-4 text-healthy-400 shrink-0" />
              ) : (
                <Copy className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 shrink-0 transition-colors" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] px-px font-medium text-neutral-400 tracking-wider uppercase">
              New Webhook Secret
            </span>
            <div
              onClick={() => handleCopy(newSecret, "secret")}
              className="bg-neutral-950/80 hover:bg-neutral-800/60 group cursor-pointer p-4 py-3 rounded-lg border border-neutral-700/40 hover:border-neutral-600/60 transition-all relative z-10 font-mono flex justify-between items-center gap-4"
            >
              <span className="break-all select-all text-xs text-neutral-300">
                {newSecret}
              </span>
              {copied === "secret" ? (
                <Check className="w-4 h-4 text-healthy-400 shrink-0" />
              ) : (
                <Copy className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 shrink-0 transition-colors" />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          <button
            onClick={() => {
              const content = `GITHUB_WEBHOOK_PAYLOAD_URL=${payloadUrl}\nGITHUB_WEBHOOK_SECRET=${newSecret}`;
              const blob = new Blob([content], { type: "text/plain" });
              const blobUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = blobUrl;
              a.download = `nexus-ops-webhook-secret.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(blobUrl);
            }}
            className="w-full flex items-center justify-center gap-2 bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 py-2.5 cursor-pointer rounded-lg font-medium transition-all duration-300 border border-neutral-700/50 hover:border-neutral-600/60"
          >
            <Download className="w-4 h-4" />
            Download as .txt
          </button>
          <button
            onClick={onClose}
            className="w-full bg-linear-to-r from-healthy-600 to-healthy-500 text-neutral-950 py-2.5 cursor-pointer rounded-lg font-bold hover:from-healthy-500 hover:to-healthy-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300"
          >
            I have saved it, Close
          </button>
        </div>
      </ModalPanel>
    );
  }

  // 編輯模式
  if (isEditing) {
    return (
      <ModalPanel>
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="text-lg font-bold text-neutral-50 tracking-widest uppercase flex items-center gap-3">
            <Edit3 className="w-4 h-4 text-healthy-400" />
            Edit Repository
          </h3>
          <button
            onClick={() => setIsEditing(false)}
            className="text-neutral-500 hover:text-neutral-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-neutral-400 px-px tracking-wider uppercase">
                Display Name
              </label>
              <Input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="NexusOps"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-neutral-400 px-px tracking-wider uppercase">
                GitHub URL
              </label>
              <Input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <button
            onClick={handleSaveEdit}
            disabled={isSaving || !editName}
            className="w-full bg-linear-to-r from-healthy-600 to-healthy-500 cursor-pointer text-neutral-950 py-2.5 rounded-lg font-bold hover:from-healthy-500 hover:to-healthy-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:cursor-not-allowed disabled:opacity-50 disabled:from-neutral-700 disabled:to-neutral-700 disabled:text-neutral-400 transition-all duration-300"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </ModalPanel>
    );
  }

  // 預設的管理選單畫面
  return (
    <ModalPanel>
      <div className="flex flex-col items-center text-center mb-8 relative z-10">
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-full bg-neutral-800/80 border border-healthy-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.1)]">
            <Waypoints className="w-8 h-8 text-healthy-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" />
          </div>
          <div className="absolute inset-0 rounded-full border border-healthy-500/10 scale-[1.3]" />
        </div>
        <h2 className="text-xl font-bold text-neutral-50 mb-1 tracking-widest uppercase">
          {repoName}
        </h2>
        {!isActive && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1 h-1 bg-warning-500 shadow-[0_0_4px_rgba(255,215,0,0.6)]" />
            <span className="text-warning-400 text-xs tracking-wider">
              Repository tracking is paused
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          {/* Edit */}
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-200 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer border border-neutral-700/50 hover:border-neutral-600/60 text-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>

          {/* Pause / Resume */}
          <button
            onClick={handleToggleTracking}
            disabled={isToggling}
            className="flex items-center justify-center gap-2 bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-200 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 border border-neutral-700/50 hover:border-neutral-600/60 text-sm"
          >
            {isToggling ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isActive ? (
              <>
                <PauseCircle className="w-3.5 h-3.5" />
                Pause
              </>
            ) : (
              <>
                <PlayCircle className="w-3.5 h-3.5 text-healthy-400" />
                <span className="text-healthy-400">Resume</span>
              </>
            )}
          </button>
        </div>

        {/* Regenerate Secret */}
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="w-full flex items-center justify-center gap-2 bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-200 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 border border-neutral-700/50 hover:border-neutral-600/60 text-sm"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`}
          />
          Regenerate Webhook Secret
        </button>

        {/* Sync History */}
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-full flex items-center justify-center gap-2 bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-200 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 border border-neutral-700/50 hover:border-healthy-500/40 text-sm hover:text-healthy-400"
        >
          <Download
            className={`w-3.5 h-3.5 ${isSyncing ? "animate-bounce" : ""}`}
          />
          {isSyncing ? "Syncing..." : "Sync History via GitHub PAT"}
        </button>
        {syncResult && (
          <div className={`text-[10px] tracking-wide text-center uppercase ${syncResult.error ? "text-critical-400" : "text-healthy-400"}`}>
            {syncResult.error || `Synced ${syncResult.count} new records.`}
          </div>
        )}

        {/* Separator */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-neutral-700/40 to-transparent" />
          <span className="text-neutral-700 text-[8px]">◆</span>
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-neutral-700/40 to-transparent" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Clear Logs */}
          <button
            onClick={handleClearLogs}
            disabled={isClearing}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 text-sm border ${
              isConfirmingClear
                ? "bg-warning-500/15 hover:bg-warning-500/20 text-warning-400 border-warning-700/50"
                : "bg-neutral-950/60 border-warning-700/40 text-warning-500/80 hover:bg-neutral-900/80 hover:text-warning-400"
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            {isClearing
              ? "Clearing..."
              : isConfirmingClear
                ? "Confirm?"
                : "Clear Logs"}
          </button>

          {/* Delete Repo */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 text-sm border ${
              isConfirmingDelete
                ? "bg-critical-500/15 hover:bg-critical-500/20 text-critical-400 border-critical-700/50"
                : "bg-neutral-950/60 border-critical-700/40 text-critical-500/80 hover:bg-neutral-900/80 hover:text-critical-400"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting
              ? "Deleting..."
              : isConfirmingDelete
                ? "Confirm?"
                : "Delete Repo"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="flex items-center justify-center gap-2 bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-400 hover:text-neutral-200 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer border border-neutral-700/40 text-sm mt-1"
        >
          Cancel
        </button>
      </div>
    </ModalPanel>
  );
}
