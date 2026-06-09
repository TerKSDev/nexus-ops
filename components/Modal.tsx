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
  default: "bg-healthy-500/4",
  danger: "bg-critical-500/4",
  warning: "bg-warning-500/4",
};

const borderColors = {
  default: "border-neutral-700/50",
  danger: "border-critical-500/25",
  warning: "border-warning-500/25",
};

const titleColors = {
  default: "text-neutral-50",
  danger: "text-critical-400",
  warning: "text-warning-400",
};

const accentColors = {
  default: "from-healthy-500/50",
  danger: "from-critical-500/50",
  warning: "from-warning-500/50",
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
            className="absolute inset-0 bg-neutral-950/85 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`bg-neutral-900/95 border ${borderColors[variant]} p-8 rounded-lg max-w-md w-full relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)] z-10`}
          >
            {/* Ambient glow */}
            <div
              className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[60px] pointer-events-none -mt-12 -mr-12 ${glowColors[variant]}`}
            />

            {/* Corner bracket decorations */}
            <div className="absolute top-3 left-3 w-5 h-5 pointer-events-none">
              <div
                className={`absolute top-0 left-0 w-full h-px bg-linear-to-r ${accentColors[variant]} to-transparent`}
              />
              <div
                className={`absolute top-0 left-0 h-full w-px bg-linear-to-b ${accentColors[variant]} to-transparent`}
              />
            </div>
            <div className="absolute top-3 right-3 w-5 h-5 pointer-events-none">
              <div
                className={`absolute top-0 right-0 w-full h-px bg-linear-to-l ${accentColors[variant]} to-transparent`}
              />
              <div
                className={`absolute top-0 right-0 h-full w-px bg-linear-to-b ${accentColors[variant]} to-transparent`}
              />
            </div>
            <div className="absolute bottom-3 left-3 w-5 h-5 pointer-events-none">
              <div
                className={`absolute bottom-0 left-0 w-full h-px bg-linear-to-r ${accentColors[variant]} to-transparent`}
              />
              <div
                className={`absolute bottom-0 left-0 h-full w-px bg-linear-to-t ${accentColors[variant]} to-transparent`}
              />
            </div>
            <div className="absolute bottom-3 right-3 w-5 h-5 pointer-events-none">
              <div
                className={`absolute bottom-0 right-0 w-full h-px bg-linear-to-l ${accentColors[variant]} to-transparent`}
              />
              <div
                className={`absolute bottom-0 right-0 h-full w-px bg-linear-to-t ${accentColors[variant]} to-transparent`}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-0.5 h-4 bg-linear-to-b from-healthy-500 to-transparent" />
                <h3
                  className={`text-base font-bold tracking-widest uppercase ${titleColors[variant]}`}
                >
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-600 hover:text-neutral-200 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
