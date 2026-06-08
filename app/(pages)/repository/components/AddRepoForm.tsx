"use client";
import { useActionState, useState } from "react";
import { addRepo } from "@/actions/repository";
import SecretModal from "./SecretModal";

export default function AddRepoForm() {
  const [state, formAction, isPending] = useActionState(addRepo, null);
  const [closedSecrets, setClosedSecrets] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  // 不使用 useEffect，直接透過 state 推導出是否要顯示 Modal
  const showModal =
    state?.success && state?.secret && !closedSecrets.includes(state.secret);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => {
      setCopied(null);
    }, 5000);
  };

  const handleDownload = () => {
    if (!state?.secret) return;
    const content = `WEBHOOK_SECRET=${state.secret}\nPAYLOAD_URL=https://nexus-ops-roan.vercel.app/api/webhook/github`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "webhook-secret.env";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    if (state?.secret) {
      setClosedSecrets([...closedSecrets, state.secret]);
    }
  };

  return (
    <>
      <form action={formAction} className="flex flex-col justify-center gap-1">
        <div className="flex items-center gap-4">
          <input
            className="w-82 bg-neutral-900 px-4 py-3 rounded-lg border border-neutral-800 focus:border-healthy-500 outline-none text-neutral-50 placeholder-neutral-400 transition-all hover:bg-neutral-800 font-mono text-sm"
            placeholder="https://github.com/username/repo"
            name="url"
            type="text"
            required
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-healthy-500 cursor-pointer text-neutral-950 px-6 py-2.5 rounded-lg font-bold hover:bg-healthy-400 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all"
          >
            {isPending ? "Adding..." : "Add Repo"}
          </button>
        </div>
        {state?.error && (
          <p className="text-critical-500 text-xs">{state.error}</p>
        )}
      </form>

      {/* Secret Modal */}
      {showModal && state?.secret && (
        <SecretModal
          secret={state.secret}
          copied={copied}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onClose={handleClose}
        />
      )}
    </>
  );
}
