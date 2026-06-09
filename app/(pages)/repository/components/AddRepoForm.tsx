"use client";
import { useActionState, useState, useEffect } from "react";
import { addRepo } from "@/actions/repository";
import SecretModal from "./SecretModal";
import { Input } from "@/components/Input";
import { useToast } from "@/components/ToastProvider";

export default function AddRepoForm() {
  const [state, formAction, isPending] = useActionState(addRepo, null);
  const [closedSecrets, setClosedSecrets] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      if (state.autoConfigured) {
        toast("Repository added and webhook automatically configured!", "success");
      } else if (!state.secret) {
        toast("Repository added successfully.", "success");
      }
    }
  }, [state, toast]);

  // Only show modal if NOT auto-configured AND we have a secret AND user hasn't closed it
  const showModal =
    state?.success && state?.secret && !state.autoConfigured && !closedSecrets.includes(state.secret);

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
        <div className="flex items-center gap-3">
          <Input
            className="flex-1 md:min-w-72"
            placeholder="https://github.com/username/repo"
            name="url"
            type="text"
            required
          />
          <button
            type="submit"
            disabled={isPending}
            className="relative overflow-hidden flex items-center justify-center bg-linear-to-r from-healthy-600 to-healthy-500 cursor-pointer text-neutral-950 px-6 py-2.5 rounded-lg font-bold hover:from-healthy-500 hover:to-healthy-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300 text-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
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
