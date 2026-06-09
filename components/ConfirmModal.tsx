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

  const btnBg = {
    default: "bg-healthy-500 hover:bg-healthy-400 text-neutral-950",
    danger: "bg-critical-500 hover:bg-critical-400 text-white",
    warning: "bg-warning-500 hover:bg-warning-400 text-neutral-950",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} variant={variant}>
      <div className="flex flex-col gap-4">
        <div className="text-sm text-neutral-400">{description}</div>

        {requireInput && (
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Type ${requireInput} to confirm`}
            variant={variant === "warning" ? "default" : variant}
          />
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-neutral-800 text-neutral-200 cursor-pointer rounded-lg font-bold hover:bg-neutral-700 transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={!isValid || isLoading}
            className={`flex-1 py-2.5 rounded-lg cursor-pointer font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${btnBg[variant]}`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
