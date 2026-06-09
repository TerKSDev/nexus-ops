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
} from "lucide-react";
import {
  deleteRepo,
  regenerateSecret,
  clearRepoLogs,
  toggleRepoTracking,
  updateRepo,
} from "@/actions/repository";
import { Input } from "@/components/Input";

interface ActionModalProps {
  repoId: string;
  repoName: string;
  url: string;
  isActive: boolean;
  isOpen: boolean;
  onClose: () => void;
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4">
        <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-lg max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-healthy-500/5 rounded-full blur-[60px] pointer-events-none -mt-12 -mr-12" />

          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-healthy-500/20 text-healthy-400 rounded-full flex items-center justify-center mb-6">
              <KeyRound className="w-8 h-8 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-50 mb-2">
              Secret Regenerated
            </h2>
            <p className="text-neutral-400 text-sm">
              Please save your new Webhook Secret now. For security reasons,{" "}
              <strong className="text-warning-500">
                it will never be shown again
              </strong>
              .
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs px-px font-medium text-neutral-400">
                Payload URL:
              </span>
              <div
                onClick={() => handleCopy(payloadUrl, "url")}
                className="bg-neutral-950 hover:bg-neutral-900 group cursor-pointer p-4 py-3 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all relative z-10 font-mono text-sm text-neutral-300 flex justify-between items-center gap-4"
              >
                <span className="break-all select-all">{payloadUrl}</span>
                {copied === "url" ? (
                  <Check className="w-4 h-4 text-healthy-500 shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 shrink-0 transition-colors" />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs px-px font-medium text-neutral-400">
                New Webhook Secret:
              </span>
              <div
                onClick={() => handleCopy(newSecret, "secret")}
                className="bg-neutral-950 hover:bg-neutral-900 group cursor-pointer p-4 py-3 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all relative z-10 font-mono text-sm text-neutral-300 flex justify-between items-center gap-4"
              >
                <span className="break-all select-all">{newSecret}</span>
                {copied === "secret" ? (
                  <Check className="w-4 h-4 text-healthy-500 shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 shrink-0 transition-colors" />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 relative z-10">
            <button
              onClick={() => {
                const content = `GITHUB_WEBHOOK_PAYLOAD_URL=${payloadUrl}\nGITHUB_WEBHOOK_SECRET=${newSecret}`;
                const blob = new Blob([content], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `nexus-ops-webhook-secret.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="w-full bg-neutral-800 text-neutral-200 py-2.5 cursor-pointer rounded-lg font-medium hover:bg-neutral-700 transition-all flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Download as .txt
            </button>
            <button
              onClick={onClose}
              className="w-full bg-healthy-500 text-neutral-950 py-2.5 cursor-pointer rounded-lg font-bold hover:bg-healthy-400 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all"
            >
              I have saved it, Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 編輯模式
  if (isEditing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-healthy-500/5 rounded-full blur-[60px] pointer-events-none -mt-12 -mr-12" />

          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-lg font-bold text-neutral-50 tracking-wide flex items-center gap-4">
              <Edit3 className="w-4 h-4 text-healthy-500" />
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
                <label className="text-xs font-medium text-neutral-200 px-px">
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
                <label className="text-xs font-medium text-neutral-200 px-px">
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
              className="w-full bg-healthy-500 cursor-pointer hover:bg-healthy-600 text-neutral-950 py-2.5 rounded-lg disabled:cursor-not-allowed font-bold disabled:bg-neutral-700 disabled:text-neutral-500 flex items-center justify-center gap-2 transition-colors duration-300"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 預設的管理選單畫面
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4">
      <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-lg max-w-md w-full relative overflow-hidden">
        {/* 背景光暈效果 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-healthy-500/5 rounded-full blur-[60px] pointer-events-none -mt-12 -mr-12" />

        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-healthy-500/20 text-healthy-400 rounded-full flex items-center justify-center mb-6">
            <Waypoints className="w-8 h-8 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-50 mb-2">
            {repoName}
          </h2>
          {!isActive && (
            <strong className="text-warning-500 text-sm">
              Repository tracking is paused.
            </strong>
          )}
        </div>

        <div className="flex flex-col gap-4 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 py-2.5 rounded-lg font-medium transition-all duration-300 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>

            {/* Pause/Resume Button */}
            <button
              onClick={handleToggleTracking}
              disabled={isToggling}
              className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 py-2.5 rounded-lg font-medium transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {isToggling ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : isActive ? (
                <>
                  <PauseCircle className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 text-healthy-400" />
                  <span className="text-healthy-400">Resume</span>
                </>
              )}
            </button>
          </div>

          {/* Regenerate Secret Button */}
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 mb-4"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`}
            />
            Regenerate Webhook Secret
          </button>

          <div className="grid grid-cols-2 gap-4">
            {/* Clear Logs Button */}
            <button
              onClick={handleClearLogs}
              disabled={isClearing}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 ${
                isConfirmingClear
                  ? "bg-warning-500/20 hover:bg-warning-500/25 text-warning-500 border border-warning-700"
                  : "bg-neutral-950 border border-warning-700 text-warning-500 hover:bg-neutral-900"
              }`}
            >
              <Eraser className="w-4 h-4" />
              {isClearing
                ? "Clearing..."
                : isConfirmingClear
                  ? "Confirm?"
                  : "Clear Logs"}
            </button>

            {/* Delete Repo Button */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 ${
                isConfirmingDelete
                  ? "bg-critical-500/20 hover:bg-critical-500/25 text-critical-500 border border-critical-700"
                  : "bg-neutral-950 border border-critical-700 text-critical-400 hover:bg-neutral-900"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting
                ? "Deleting..."
                : isConfirmingDelete
                  ? "Confirm?"
                  : "Delete Repo"}
            </button>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 py-2.5 rounded-lg font-medium transition-all duration-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
