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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4">
      <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-lg max-w-md w-full relative overflow-hidden">
        {/* 背景光暈效果 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-healthy-500/5 rounded-full blur-[60px] pointer-events-none -mt-12 -mr-12" />

        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-healthy-500/20 text-healthy-400 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-50 mb-2">
            Repository Added!
          </h2>
          <p className="text-neutral-400 text-sm">
            Please save your Webhook Secret now. For security reasons,{" "}
            <strong className="text-warning-500">
              it will never be shown again
            </strong>
            .
          </p>
        </div>
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-neutral-200 text-xs px-px font-medium">
              Payload URL:
            </span>
            <div
              onClick={() =>
                onCopy(
                  "https://nexus-ops-roan.vercel.app/api/webhook/github",
                  "url",
                )
              }
              className="bg-neutral-950 hover:bg-neutral-900 group cursor-pointer p-4 py-3 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all relative z-10 font-mono text-sm text-neutral-300 flex justify-between items-center gap-4"
            >
              <span className="break-all select-all">
                https://nexus-ops-roan.vercel.app/api/webhook/github
              </span>
              {copied === "url" ? (
                <Check className="w-4 h-4 text-healthy-500 shrink-0" />
              ) : (
                <Copy className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 shrink-0 transition-colors" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-neutral-200 text-xs px-px font-medium">
              Webhook Secret:
            </span>
            <div
              onClick={() => onCopy(secret, "secret")}
              className="bg-neutral-950 hover:bg-neutral-900 group cursor-pointer p-4 py-3 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all relative z-10 font-mono text-sm text-neutral-300 flex justify-between items-center gap-4"
            >
              <span className="break-all select-all">{secret}</span>
              {copied === "secret" ? (
                <Check className="w-4 h-4 text-healthy-500 shrink-0" />
              ) : (
                <Copy className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 shrink-0 transition-colors" />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 relative z-10">
          <button
            onClick={onDownload}
            className="flex-1 flex items-center justify-center cursor-pointer gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 py-2.5 rounded-lg font-medium transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Download .env
          </button>

          <button
            onClick={onClose}
            className="w-full bg-healthy-500 text-neutral-950 py-2.5 cursor-pointer rounded-lg font-bold hover:bg-healthy-600 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all duration-300"
          >
            I have saved it, Close
          </button>
        </div>
      </div>
    </div>
  );
}
