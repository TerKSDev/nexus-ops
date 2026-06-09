"use client";

import { signIn } from "next-auth/react";
import { Play, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { Input } from "@/components/Input";

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
          // Auto login after successful registration
          await signIn("credentials", { email, password, callbackUrl: "/overview" });
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
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-healthy-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 border border-neutral-800 rounded-lg bg-neutral-900 relative overflow-hidden group shadow-2xl z-10">
        <div className="flex flex-col items-center text-center relative z-10 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-8 w-1 bg-linear-to-b from-healthy-500 to-transparent" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-neutral-50 to-neutral-400 tracking-widest uppercase">
              Nexus Ops
            </h1>
            <div className="h-8 w-1 bg-linear-to-b from-healthy-500 to-transparent rotate-180" />
          </div>
          <p className="text-neutral-400 text-sm">
            {isLogin ? "Sign in to your command center" : "Create a new command center account"}
          </p>
        </div>

        <form
          onSubmit={handleCredentialsLogin}
          className="flex flex-col gap-4 mb-8 relative z-10"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-200 px-px">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-200 px-px">
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

          {errorMsg && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-healthy-500 cursor-pointer hover:bg-healthy-600 text-neutral-950 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            {isLogin ? "Sign in with Email" : "Create Account"}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
            }}
            className="text-neutral-400 hover:text-neutral-200 text-sm mt-2 transition-colors"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </form>

        <div className="relative mb-8 z-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-neutral-900 px-4 text-neutral-500 uppercase tracking-wider">
              or
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          <button
            onClick={() => signIn("github", { callbackUrl: "/overview" })}
            type="button"
            className="w-full bg-neutral-800 hover:bg-neutral-700 cursor-pointer text-neutral-100 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
            Continue with GitHub
          </button>

          <button
            onClick={() => signIn("guest", { callbackUrl: "/overview" })}
            type="button"
            className="w-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 cursor-pointer text-neutral-300 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Play className="w-4 h-4 fill-current" />
            Continue as Guest
          </button>
        </div>
      </div>

      {/* Cyberpunk grid bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-[linear-gradient(to_top,rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none" />
    </div>
  );
}
