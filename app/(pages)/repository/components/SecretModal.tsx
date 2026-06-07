import { CheckCircle2, Copy, Download } from "lucide-react";

interface SecretModalProps {
  secret: string;
  copied: boolean;
  onCopy: () => void;
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
      <div className="bg-neutral-900 border border-neutral-700/60 p-8 rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden">
        {/* 背景光暈效果 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-healthy-500/10 rounded-full blur-[60px] pointer-events-none -mt-16 -mr-16" />

        <div className="flex flex-col items-center text-center mb-6 relative z-10">
          <div className="w-16 h-16 bg-healthy-500/20 text-healthy-400 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-50 mb-2">
            Repository Added!
          </h2>
          <p className="text-neutral-400 text-sm">
            Please save your Webhook Secret now. For security reasons,{" "}
            <strong className="text-warning-400">
              it will never be shown again
            </strong>
            .
          </p>
        </div>
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 mb-6 relative z-10 font-mono text-sm text-neutral-300 break-all select-all">
          {secret}
        </div>
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex gap-3">
            <button
              onClick={onCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 py-2.5 rounded-lg font-medium transition-all"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy Secret"}
            </button>
            <button
              onClick={onDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 py-2.5 rounded-lg font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              Download .env
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-healthy-500 text-neutral-950 py-3 rounded-lg font-bold hover:bg-healthy-400 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all mt-2"
          >
            I have saved it, Close
          </button>
        </div>
      </div>
    </div>
  );
}
