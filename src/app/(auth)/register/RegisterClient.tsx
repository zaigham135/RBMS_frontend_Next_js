"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, MoveRight, SquareStack, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { AuthRedirectCard } from "@/components/auth/AuthRedirectCard";
import { getAuthTheme } from "@/components/auth/authTheme";
import { useGuestTheme } from "@/hooks/useGuestTheme";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const rotatingMessages = [
  "Setting up your account...",
  "Preparing your workspace...",
  "Finalizing your access...",
];

export function RegisterClient() {
  const { register, completeOAuthLogin } = useAuth();
  const searchParams = useSearchParams();
  const { dark, toggle } = useGuestTheme();
  const t = getAuthTheme(dark);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(rotatingMessages[0]);

  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("jwt") || searchParams.get("accessToken");
    const error = searchParams.get("error");
    if (error) { toast.error(error); return; }
    if (!token) return;
    try { completeOAuthLogin(searchParams); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Google sign up failed."); }
  }, [completeOAuthLogin, searchParams]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = window.setInterval(() => {
      setLoadingMessage(cur => rotatingMessages[(rotatingMessages.indexOf(cur) + 1) % rotatingMessages.length]);
    }, 900);
    return () => window.clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match."); return; }
    setLoadingMessage(rotatingMessages[0]);
    setIsLoading(true);
    try { await register(form.name, form.email, form.password); } finally { setIsLoading(false); }
  };

  return (
    <div className={`relative h-screen overflow-hidden transition-colors duration-300 ${dark ? "bg-[#060d1a]" : "bg-[#eef2f7]"}`}>
      {/* Theme toggle */}
      <div className="absolute right-5 top-5 z-50">
        <ThemeToggle dark={dark} onToggle={toggle} />
      </div>

      {isLoading && (
        <AuthRedirectCard overlay tone="progress" title="Creating account..."
          statusTitle="Setting up your workspace" statusSubtitle={loadingMessage} />
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
            <div className="pt-8">
              <h1 className={t.heroTitle}>Join the future of work</h1>
              <p className={t.heroBody}>
                Create your account to start managing projects, assigning roles, and tracking progress with unparalleled clarity.
              </p>
              <div className={`mt-8 space-y-3 ${t.heroMeta}`}>
                {["Role-based access control","Real-time task synchronization","Advanced reporting dashboards"].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/85" />{item}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-white/8 pt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center -space-x-2">
                  {["AR","SJ","MK"].map((av, i) => (
                    <div key={av} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#11192f] text-[10px] font-semibold text-white ${i===0?"bg-[#f08a77]":i===1?"bg-[#56b6ff]":"bg-[#7c66ff]"}`}>{av}</div>
                  ))}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#11192f] bg-white/10 text-[10px] font-semibold text-white">+5</div>
                </div>
                <p className="text-[14px] text-white/66">Join <span className="font-semibold text-white">5,000+</span> professionals today</p>
              </div>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className={t.rightPanel}>
            <div className="flex-1">
              <div>
                <h2 className={t.title}>Create an account</h2>
                <p className={t.subtitle}>Enter your details to get started with TaskMan.</p>
              </div>

              <form onSubmit={handleSubmit} className={t.form}>
                <div className="space-y-2">
                  <label htmlFor="name" className={t.label}>Full Name</label>
                  <div className="relative">
                    <User className={t.inputIcon} />
                    <input id="name" required autoComplete="name" placeholder="John Doe"
                      value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={t.input} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="reg-email" className={t.label}>Work Email</label>
                  <div className="relative">
                    <Mail className={t.inputIcon} />
                    <input id="reg-email" type="email" required autoComplete="email" placeholder="john@company.com"
                      value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={t.input} />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="reg-password" className={t.label}>Password</label>
                    <div className="relative">
                      <Lock className={t.inputIcon} />
                      <input id="reg-password" type={showPass ? "text" : "password"} required minLength={8}
                        autoComplete="new-password" placeholder="••••••••"
                        value={form.password} onChange={e => setForm({...form, password: e.target.value})} className={t.inputWithToggle} />
                      <button type="button" onClick={() => setShowPass(v => !v)} className={t.eyeButton}>
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className={t.label}>Confirm</label>
                    <div className="relative">
                      <Lock className={t.inputIcon} />
                      <input id="confirm-password" type={showConfirmPass ? "text" : "password"} required minLength={8}
                        autoComplete="new-password" placeholder="••••••••"
                        value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} className={t.inputWithToggle} />
                      <button type="button" onClick={() => setShowConfirmPass(v => !v)} className={t.eyeButton}>
                        {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className={`${t.primaryButton} mt-1`}>
                  {isLoading ? "Creating account..." : "Create Account"}
                  <MoveRight className="h-4 w-4" />
                </button>
              </form>

              <div className={`mt-4 text-center text-[15px] ${dark ? "text-white/50" : "text-[#64748b]"}`}>
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-[#4c8cff] hover:underline">Sign in here</Link>
              </div>
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
