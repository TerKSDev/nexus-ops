import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "./Modal";
import { Input } from "./Input";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  requireInput?: string;
  variant?: "default" | "danger" | "warning";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  requireInput,
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    if (!isOpen) setInputVal("");
  }, [isOpen]);

  const isValid = requireInput ? inputVal === requireInput : true;

  const btnStyles = {
    default:
      "bg-linear-to-r from-healthy-600 to-healthy-500 hover:from-healthy-500 hover:to-healthy-400 text-neutral-950 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]",
    danger:
      "bg-linear-to-r from-critical-700 to-critical-500 hover:from-critical-600 hover:to-critical-400 text-white hover:shadow-[0_0_15px_rgba(255,0,123,0.3)]",
    warning:
      "bg-linear-to-r from-warning-700 to-warning-500 hover:from-warning-600 hover:to-warning-400 text-neutral-950 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} variant={variant}>
      <div className="flex flex-col gap-4">
        <div className="text-sm text-neutral-400 leading-relaxed">
          {description}
        </div>

        {requireInput && (
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Type "${requireInput}" to confirm`}
            variant={variant === "warning" ? "default" : variant}
          />
        )}

        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 text-center bg-neutral-800/70 text-neutral-300 cursor-pointer rounded-lg font-medium hover:bg-neutral-700/80 hover:text-neutral-100 transition-all duration-200 disabled:opacity-50 border border-neutral-700/50 text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={!isValid || isLoading}
            className={`flex-1 py-2.5 text-center rounded-lg cursor-pointer font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-neutral-700 disabled:to-neutral-700 disabled:shadow-none flex items-center justify-center gap-2 text-sm ${btnStyles[variant]}`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
