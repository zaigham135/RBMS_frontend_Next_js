"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Github, Lock, Mail, MoveRight, SquareStack } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { AuthRedirectCard } from "@/components/auth/AuthRedirectCard";
import { getAuthTheme } from "@/components/auth/authTheme";
import { useGuestTheme } from "@/hooks/useGuestTheme";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const REMEMBERED_EMAIL_KEY = "tm_remembered_email";

export function LoginClient() {
  const { login, loginWithGoogle, completeOAuthLogin } = useAuth();
  const searchParams = useSearchParams();
  const { dark, toggle } = useGuestTheme();
  const t = getAuthTheme(dark);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Checking your workspace...");

  useEffect(() => {
    const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (!rememberedEmail) return;
    setEmail(rememberedEmail);
    setRememberMe(true);
  }, []);

  useEffect(() => {
    const authError = sessionStorage.getItem("auth_error");
    if (authError) {
      toast.error(authError);
      sessionStorage.removeItem("auth_error");
    }
  }, []);

  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("jwt") || searchParams.get("accessToken");
    const error = searchParams.get("error");
    if (error) { toast.error(error); return; }
    if (!token) return;
    try { completeOAuthLogin(searchParams); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Google login failed."); }
  }, [completeOAuthLogin, searchParams]);

  useEffect(() => {
    if (!isLoading && !isGoogleLoading) return;
    const messages = ["Checking your workspace...", "Verifying permissions...", "Preparing your dashboard..."];
    const interval = window.setInterval(() => {
      setLoadingMessage(cur => messages[(messages.indexOf(cur) + 1) % messages.length]);
    }, 900);
    return () => window.clearInterval(interval);
  }, [isLoading, isGoogleLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMessage("Checking your workspace...");
    setIsLoading(true);
    if (rememberMe) localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    else localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    try { await login(email, password); } finally { setIsLoading(false); }
  };

  const handleGoogleLogin = () => {
    setLoadingMessage("Redirecting to Google...");
    setIsGoogleLoading(true);
    loginWithGoogle();
  };

  const handleGithubLogin = () => {
    toast.info("GitHub sign in is not connected yet. Use email or Google for now.");
  };

  return (
    <div className={`relative h-screen overflow-hidden transition-colors duration-300 ${dark ? "bg-[#0b1120]" : "bg-white"}`}>
      {/* Theme toggle */}
      <div className="absolute right-5 top-5 z-50">
        <ThemeToggle dark={dark} onToggle={toggle} />
      </div>

      {(isLoading || isGoogleLoading) && (
        <AuthRedirectCard
          overlay
          tone="progress"
          title="Redirecting..."
          statusTitle={isGoogleLoading ? "Google sign-in started" : "Authentication in progress"}
          statusSubtitle={isGoogleLoading ? "Forwarding to Google authentication..." : loadingMessage}
        />
      )}

      <div className={t.shell}>
        <div className={t.card}>
          {/* ── Left panel (always dark branded) ── */}
          <div className={t.leftPanel}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4c8cff] shadow-[0_14px_30px_rgba(76,140,255,0.38)]">
                <SquareStack className="h-5 w-5" />
              </div>
              <span className={t.brandText}>TaskMan</span>
            </div>
            <div className="pt-10">
              <h1 className={`${t.heroTitle} max-w-none whitespace-nowrap`}>Stay Sharp, Stay Ahead</h1>
              <p className={t.heroBody}>
                The ultimate project management platform designed to streamline your workflow, empower your team, and deliver results faster.
              </p>
            </div>
            <div className="border-t border-white/8 pt-6">
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex items-center -space-x-2">
                  {["AR","SJ","MK"].map((av, i) => (
                    <div key={av} className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#11192f] text-[12px] font-semibold text-white ${i===0?"bg-[#f08a77]":i===1?"bg-[#56b6ff]":"bg-[#7c66ff]"}`}>{av}</div>
                  ))}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#11192f] bg-white/10 text-[12px] font-semibold text-white">+2k</div>
                </div>
                <p className="text-[14px] text-white/66">Trusted by <span className="font-semibold text-white">2,000+</span> teams globally</p>
              </div>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className={`${t.rightPanel} justify-center`}>
            <div>
              <h2 className={t.title}>Welcome back</h2>
              <p className={t.subtitle}>Please enter your details to access your dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className={t.form}>
              <div className="space-y-2.5">
                <label htmlFor="email" className={t.label}>Email or Username</label>
                <div className="relative">
                  <Mail className={t.inputIcon} />
                  <input id="email" type="text" required autoComplete="username" placeholder="Enter your email"
                    value={email} onChange={e => setEmail(e.target.value)} className={t.input} />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="password" className={t.label}>Password</label>
                  <Link href="/forgot-password" className="text-[14px] font-medium text-[#4c8cff] transition-opacity hover:opacity-70 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className={t.inputIcon} />
                  <input id="password" type={showPass ? "text" : "password"} required autoComplete="current-password"
                    placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className={t.inputWithToggle} />
                  <button type="button" onClick={() => setShowPass(v => !v)} className={t.eyeButton}>
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <label className={t.checkboxLabel}>
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#cbd5e1] text-[#4c8cff] focus:ring-[#4c8cff]" />
                Remember for 30 days
              </label>

              <button type="submit" disabled={isLoading || isGoogleLoading} className={t.primaryButton}>
                {isLoading ? "Signing in..." : "Sign in"}
                <MoveRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-7">
              <div className="flex items-center gap-4">
                <div className={t.dividerLine} />
                <span className={t.dividerText}>Or continue with</span>
                <div className={t.dividerLine} />
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading} className={t.secondaryButton}>
                  <span className="text-[20px] font-semibold text-[#ea4335]">G</span>
                  {isGoogleLoading ? "Redirecting..." : "Google"}
                </button>
                <button type="button" onClick={handleGithubLogin} className={t.secondaryButton}>
                  <Github className="h-4 w-4" />
                  GitHub
                </button>
              </div>
            </div>

            <div className={t.helperText}>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-[#4c8cff] hover:underline">Register now</Link>
            </div>

            <div className={t.footerLinks}>
              <Link href="/privacy-policy" className={t.footerLinkHover}>Privacy Policy</Link>
              <span>•</span>
              <Link href="/terms" className={t.footerLinkHover}>Terms of Service</Link>
              <span>•</span>
              <Link href="/help-center" className={t.footerLinkHover}>Help Center</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
