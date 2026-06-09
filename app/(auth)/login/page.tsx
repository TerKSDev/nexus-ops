"use client";

import { signIn } from "next-auth/react";
import { Play, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { Input } from "@/components/Input";
import { motion, AnimatePresence } from "motion/react";

// GitHub SVG icon
function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (res?.error) {
          setErrorMsg("Invalid email or password.");
        } else {
          router.push("/overview");
        }
      } else {
        const res = await registerUser({ email, password });
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          await signIn("credentials", {
            email,
            password,
            callbackUrl: "/overview",
          });
        }
      }
    } catch (error) {
      console.log(error);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-healthy-500/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-healthy-500/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,229,255,0.025)_1px,transparent_1px),linear-gradient(to_right,rgba(0,229,255,0.025)_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_80%)] pointer-events-none" />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md relative overflow-hidden z-10"
      >
        {/* Corner bracket decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none z-20">
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-healthy-500/70 to-transparent" />
          <div className="absolute top-0 left-0 h-full w-px bg-linear-to-b from-healthy-500/70 to-transparent" />
        </div>
        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none z-20">
          <div className="absolute top-0 right-0 w-full h-px bg-linear-to-l from-healthy-500/70 to-transparent" />
          <div className="absolute top-0 right-0 h-full w-px bg-linear-to-b from-healthy-500/70 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none z-20">
          <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-healthy-500/70 to-transparent" />
          <div className="absolute bottom-0 left-0 h-full w-px bg-linear-to-t from-healthy-500/70 to-transparent" />
        </div>
        <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none z-20">
          <div className="absolute bottom-0 right-0 w-full h-px bg-linear-to-l from-healthy-500/70 to-transparent" />
          <div className="absolute bottom-0 right-0 h-full w-px bg-linear-to-t from-healthy-500/70 to-transparent" />
        </div>

        <div className="bg-neutral-900/95 border border-neutral-700/50 rounded-lg p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,229,255,0.04)]">
          {/* Inner ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-healthy-500/4 rounded-full blur-[60px] pointer-events-none -mt-16 -mr-16" />

          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            <div className="flex items-center gap-3 mb-5">
              {/* Left vertical bar */}
              <div className="w-px h-10 bg-linear-to-b from-transparent via-healthy-500 to-transparent" />
              <h1 className="text-3xl font-bold text-neutral-50 tracking-[0.2em] uppercase">
                Nexus{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-healthy-400 to-healthy-200">
                  Ops
                </span>
              </h1>
              <div className="w-px h-10 bg-linear-to-b from-transparent via-healthy-500 to-transparent" />
            </div>

            {/* Divider with diamond */}
            <div className="flex items-center gap-3 w-full mb-5">
              <div className="flex-1 h-px bg-linear-to-r from-transparent to-neutral-700/60" />
              <span className="text-healthy-500/40 text-[8px]">◆</span>
              <div className="flex-1 h-px bg-linear-to-l from-transparent to-neutral-700/60" />
            </div>

            {/* Mode label */}
            <AnimatePresence mode="wait">
              <motion.p
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-[10px] text-neutral-500 uppercase tracking-[0.25em]"
              >
                {isLogin
                  ? "Commander Authentication"
                  : "New Commander Registration"}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Credentials form */}
          <form
            onSubmit={handleCredentialsLogin}
            className="flex flex-col gap-4 mb-6 relative z-10"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest px-px">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="commander@nexus.ops"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest px-px">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-critical-400 text-xs bg-critical-500/8 border border-critical-500/20 px-4 py-2.5 rounded-lg leading-relaxed"
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 bg-linear-to-r from-healthy-600 to-healthy-500 cursor-pointer text-neutral-950 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:from-healthy-500 hover:to-healthy-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              {isLogin ? "Sign In" : "Create Account"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg("");
              }}
              className="text-neutral-600 hover:text-healthy-400 text-xs mt-1 transition-colors text-center tracking-wide"
            >
              {isLogin
                ? "Need an account? Sign up →"
                : "Already registered? Sign in →"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6 z-10">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-neutral-800/80" />
              <span className="text-neutral-700 text-[9px] uppercase tracking-[0.2em]">
                or continue with
              </span>
              <div className="flex-1 h-px bg-neutral-800/80" />
            </div>
          </div>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-3 relative z-10">
            <button
              onClick={() => signIn("github", { callbackUrl: "/overview" })}
              type="button"
              className="w-full bg-neutral-800/80 hover:bg-neutral-700/80 cursor-pointer text-neutral-200 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2.5 transition-all duration-200 border border-neutral-700/50 hover:border-neutral-600/60 text-sm"
            >
              <GitHubIcon />
              Continue with GitHub
            </button>

            <button
              onClick={() => signIn("guest", { callbackUrl: "/overview" })}
              type="button"
              className="w-full bg-transparent hover:bg-neutral-800/50 cursor-pointer text-neutral-500 hover:text-neutral-300 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2.5 transition-all duration-200 border border-neutral-800/60 hover:border-neutral-700/50 text-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Continue as Guest
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bottom signature */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 text-[9px] text-neutral-600 uppercase tracking-[0.3em] z-10"
      >
        Nexus Ops · Command Center v1.0
      </motion.p>
    </div>
  );
}
