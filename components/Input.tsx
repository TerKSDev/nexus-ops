import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  variant?: "default" | "danger" | "discord" | "telegram";
}

const variantStyles = {
  default: "focus:border-healthy-500/60 focus:shadow-[0_0_0_2px_rgba(0,229,255,0.08)]",
  danger: "focus:border-critical-500/60 focus:shadow-[0_0_0_2px_rgba(255,0,123,0.08)]",
  discord: "focus:border-[#5865F2]/60 focus:shadow-[0_0_0_2px_rgba(88,101,242,0.08)]",
  telegram: "focus:border-[#0088cc]/60 focus:shadow-[0_0_0_2px_rgba(0,136,204,0.08)]",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const focusStyle = variantStyles[variant];

    return (
      <input
        ref={ref}
        className={`w-full bg-neutral-900/80 px-4 py-2.5 rounded-lg border border-neutral-700/50 outline-none text-neutral-100 placeholder-neutral-500 transition-all duration-200 hover:bg-neutral-800/60 hover:border-neutral-600/60 focus:bg-neutral-800/60 font-mono text-sm disabled:opacity-50 ${focusStyle} ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
