"use client";

import { motion } from "motion/react";
import { CheckCircle2, Copy, Download, Check } from "lucide-react";

interface SecretModalProps {
  secret: string;
  copied: string | null;
  onCopy: (text: string, type: string) => void;
  onDownload: () => void;
  onClose: () => void;
}

export default function SecretModal({
  secret,
  copied,
  onCopy,
  onDownload,
  onClose,
}: SecretModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-neutral-900/95 border border-neutral-700/50 p-10 rounded-lg max-w-md w-full relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,229,255,0.04)]"
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-healthy-500/[0.04] rounded-full blur-[60px] pointer-events-none -mt-12 -mr-12" />

        {/* Corner bracket decorations */}
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

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-neutral-800/80 border border-healthy-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.1)]">
              <CheckCircle2 className="w-8 h-8 text-healthy-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
            </div>
            <div className="absolute inset-0 rounded-full border border-healthy-500/10 scale-[1.3]" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-50 mb-2 tracking-wide">
            Repository Added!
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Please save your Webhook Secret now. For security reasons,{" "}
            <strong className="text-warning-400 font-semibold">
              it will never be shown again
            </strong>
            .
          </p>
        </div>

        {/* Copy fields */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] px-px font-medium text-neutral-400 tracking-wider uppercase">
              Payload URL
            </span>
            <div
              onClick={() =>
                onCopy(
                  "https://nexus-ops-roan.vercel.app/api/webhook/github",
                  "url",
                )
              }
              className="bg-neutral-950/80 hover:bg-neutral-800/60 group cursor-pointer p-4 py-3 rounded-lg border border-neutral-700/40 hover:border-neutral-600/60 transition-all relative z-10 font-mono text-sm text-neutral-300 flex justify-between items-center gap-4"
            >
              <span className="break-all select-all text-xs">
                https://nexus-ops-roan.vercel.app/api/webhook/github
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
              Webhook Secret
            </span>
            <div
              onClick={() => onCopy(secret, "secret")}
              className="bg-neutral-950/80 hover:bg-neutral-800/60 group cursor-pointer p-4 py-3 rounded-lg border border-neutral-700/40 hover:border-neutral-600/60 transition-all relative z-10 font-mono text-sm text-neutral-300 flex justify-between items-center gap-4"
            >
              <span className="break-all select-all text-xs">{secret}</span>
              {copied === "secret" ? (
                <Check className="w-4 h-4 text-healthy-400 shrink-0" />
              ) : (
                <Copy className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 shrink-0 transition-colors" />
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 relative z-10">
          <button
            onClick={onDownload}
            className="flex items-center justify-center gap-2 bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 py-2.5 cursor-pointer rounded-lg font-medium transition-all duration-300 border border-neutral-700/50 hover:border-neutral-600/60"
          >
            <Download className="w-4 h-4" />
            Download .env
          </button>
          <button
            onClick={onClose}
            className="w-full bg-linear-to-r from-healthy-600 to-healthy-500 text-neutral-950 py-2.5 cursor-pointer rounded-lg font-bold hover:from-healthy-500 hover:to-healthy-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300"
          >
            I have saved it, Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
