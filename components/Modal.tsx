import { X } from "lucide-react";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: "default" | "danger" | "warning";
}

const glowColors = {
  default: "bg-healthy-500/10",
  danger: "bg-critical-500/10",
  warning: "bg-warning-500/10",
};

const borderColors = {
  default: "border-neutral-800",
  danger: "border-critical-500/30",
  warning: "border-warning-500/30",
};

const titleColors = {
  default: "text-neutral-50",
  danger: "text-critical-400",
  warning: "text-warning-500",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  variant = "default",
}: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className={`bg-neutral-900 border ${borderColors[variant]} p-8 rounded-lg max-w-md w-full relative overflow-hidden shadow-2xl z-10`}
          >
            <div
              className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[60px] pointer-events-none -mt-12 -mr-12 ${glowColors[variant]}`}
            />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3
                className={`text-lg font-bold tracking-wide flex items-center gap-4 ${titleColors[variant]}`}
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative z-10">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
