import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  variant?: "default" | "danger" | "discord" | "telegram";
  containerClassName?: string;
}

const variantStyles = {
  default: "focus:border-healthy-500/60 focus:shadow-[0_0_0_2px_rgba(0,229,255,0.08)]",
  danger: "focus:border-critical-500/60 focus:shadow-[0_0_0_2px_rgba(255,0,123,0.08)]",
  discord: "focus:border-[#5865F2]/60 focus:shadow-[0_0_0_2px_rgba(88,101,242,0.08)]",
  telegram: "focus:border-[#0088cc]/60 focus:shadow-[0_0_0_2px_rgba(0,136,204,0.08)]",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", variant = "default", type, containerClassName = "", ...props }, ref) => {
    const focusStyle = variantStyles[variant];
    const [showPassword, setShowPassword] = useState(false);
    
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={`relative w-full ${containerClassName}`}>
        <input
          ref={ref}
          type={actualType}
          className={`w-full bg-neutral-800/60 px-4 py-2.5 rounded-lg border border-neutral-700/50 outline-none text-neutral-100 placeholder-neutral-500 transition-all duration-200 hover:bg-neutral-700/60 hover:border-neutral-600/60 focus:bg-neutral-700/60 font-mono text-sm disabled:opacity-50 ${isPassword ? 'pr-10' : ''} ${focusStyle} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
