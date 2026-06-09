import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  variant?: "default" | "danger" | "discord" | "telegram";
}

const variantStyles = {
  default: "focus:border-healthy-500",
  danger: "focus:border-critical-500",
  discord: "focus:border-[#5865F2]",
  telegram: "focus:border-[#0088cc]",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const focusStyle = variantStyles[variant];

    return (
      <input
        ref={ref}
        className={`w-full bg-neutral-900 px-4 py-3 rounded-lg border border-neutral-800 outline-none text-neutral-50 placeholder-neutral-500 transition-all hover:bg-neutral-800 font-mono text-sm disabled:opacity-50 ${focusStyle} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
