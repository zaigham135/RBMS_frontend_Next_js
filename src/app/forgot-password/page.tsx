"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, SquareStack, MoveRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { authTheme } from "@/components/auth/authTheme";

type Step = "email" | "otp" | "password" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email"); return; }
    setIsLoading(true);
    try {
      await authService.sendOtp(email.trim().toLowerCase());
      toast.success("OTP sent to your email!");
      setStep("otp");
      setResendCooldown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to send OTP. Check your email.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP input handling ────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < 6) { toast.error("Please enter the complete 6-digit OTP"); return; }
    setIsLoading(true);
    try {
      await authService.verifyOtp(email.trim().toLowerCase(), otpStr);
      toast.success("OTP verified!");
      setStep("password");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    try {
      await authService.sendOtp(email.trim().toLowerCase());
      toast.success("New OTP sent!");
      setOtp(["", "", "", "", "", ""]);
      setResendCooldown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    setIsLoading(true);
    try {
      await authService.resetPassword(email.trim().toLowerCase(), otp.join(""), newPassword);
      toast.success("Password reset successfully!");
      setStep("done");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f5f7fb] p-3 lg:p-5 animate-in fade-in duration-300">
      <div className={authTheme.shell}>
        <div className={authTheme.card}>
          {/* Left panel */}
          <div className={authTheme.leftPanel}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4c8cff] shadow-[0_14px_30px_rgba(76,140,255,0.38)]">
                <SquareStack className="h-5 w-5" />
              </div>
              <span className={authTheme.brandText}>TaskMan</span>
            </div>
            <div className="pt-10">
              <h1 className={`${authTheme.heroTitle} max-w-none`}>
                {step === "email" && "Reset Your Password"}
                {step === "otp" && "Check Your Email"}
                {step === "password" && "Create New Password"}
                {step === "done" && "All Done!"}
              </h1>
              <p className={authTheme.heroBody}>
                {step === "email" && "Enter your registered email and we'll send you a one-time code to reset your password."}
                {step === "otp" && "We've sent a 6-digit OTP to your email. Enter it below to continue."}
                {step === "password" && "Choose a strong password for your account. You'll use it to sign in."}
                {step === "done" && "Your password has been updated. You can now sign in with your new password."}
              </p>
            </div>
            {/* Step indicators */}
            <div className="flex items-center gap-3">
              {(["email", "otp", "password"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    step === s ? "bg-white text-[#11192f]" :
                    (["email", "otp", "password", "done"].indexOf(step) > i) ? "bg-[#4c8cff] text-white" :
                    "bg-white/20 text-white/50"
                  }`}>
                    {(["email", "otp", "password", "done"].indexOf(step) > i) ? "✓" : i + 1}
                  </div>
                  {i < 2 && <div className="h-px w-6 bg-white/20" />}
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className={`${authTheme.rightPanel} justify-center`}>

            {/* ── Step 1: Email ─────────────────────────────────────────── */}
            {step === "email" && (
              <>
                <div>
                  <h2 className={authTheme.title}>Forgot password?</h2>
                  <p className={authTheme.subtitle}>Enter your email to receive a reset code.</p>
                </div>
                <form onSubmit={handleSendOtp} className={authTheme.form}>
                  <div className="space-y-2.5">
                    <label htmlFor="fp-email" className={authTheme.label}>Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                      <input
                        id="fp-email"
                        type="email"
                        required
                        autoFocus
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={authTheme.input}
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className={authTheme.primaryButton}>
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                    <MoveRight className="h-4 w-4" />
                  </button>
                </form>
                <div className={authTheme.helperText}>
                  <Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-[#2f66ff] hover:underline">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to login
                  </Link>
                </div>
              </>
            )}

            {/* ── Step 2: OTP ───────────────────────────────────────────── */}
            {step === "otp" && (
              <>
                <div>
                  <h2 className={authTheme.title}>Enter OTP</h2>
                  <p className={authTheme.subtitle}>
                    We sent a 6-digit code to <span className="font-semibold text-[#0f172a]">{email}</span>
                  </p>
                </div>
                <form onSubmit={handleVerifyOtp} className={authTheme.form}>
                  {/* OTP boxes */}
                  <div className="flex items-center justify-center gap-3 py-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        className={`h-14 w-12 rounded-2xl border-2 text-center text-xl font-bold text-[#0f172a] outline-none transition-all ${
                          digit ? "border-[#4c8cff] bg-[#f0f6ff]" : "border-[#dbe3ef] bg-[#fbfcfe]"
                        } focus:border-[#4c8cff] focus:bg-white`}
                      />
                    ))}
                  </div>

                  <button type="submit" disabled={isLoading || otp.join("").length < 6} className={authTheme.primaryButton}>
                    {isLoading ? "Verifying..." : "Verify OTP"}
                    <MoveRight className="h-4 w-4" />
                  </button>
                </form>

                {/* Resend */}
                <div className="mt-5 text-center">
                  <p className="text-sm text-[#64748b]">Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isLoading}
                    className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2f66ff] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>

                <div className={authTheme.helperText}>
                  <button type="button" onClick={() => setStep("email")} className="inline-flex items-center gap-1.5 font-semibold text-[#2f66ff] hover:underline">
                    <ArrowLeft className="h-3.5 w-3.5" /> Change email
                  </button>
                </div>
              </>
            )}

            {/* ── Step 3: New Password ──────────────────────────────────── */}
            {step === "password" && (
              <>
                <div>
                  <h2 className={authTheme.title}>New password</h2>
                  <p className={authTheme.subtitle}>Choose a strong password (min. 6 characters).</p>
                </div>
                <form onSubmit={handleResetPassword} className={authTheme.form}>
                  <div className="space-y-2.5">
                    <label htmlFor="new-pass" className={authTheme.label}>New password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                      <input
                        id="new-pass"
                        type={showPass ? "text" : "password"}
                        required
                        autoFocus
                        minLength={6}
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className={authTheme.inputWithToggle}
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475467]">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label htmlFor="confirm-pass" className={authTheme.label}>Confirm password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                      <input
                        id="confirm-pass"
                        type={showConfirm ? "text" : "password"}
                        required
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className={`${authTheme.inputWithToggle} ${
                          confirmPassword && confirmPassword !== newPassword ? "border-red-400 focus:border-red-400" : ""
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475467]">
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-xs text-red-500">Passwords do not match</p>
                    )}
                  </div>

                  {/* Password strength indicator */}
                  {newPassword && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                            newPassword.length >= i * 3
                              ? i <= 1 ? "bg-red-400" : i <= 2 ? "bg-amber-400" : i <= 3 ? "bg-blue-400" : "bg-green-500"
                              : "bg-gray-200"
                          }`} />
                        ))}
                      </div>
                      <p className="text-xs text-[#94a3b8]">
                        {newPassword.length < 6 ? "Too short" : newPassword.length < 9 ? "Weak" : newPassword.length < 12 ? "Good" : "Strong"}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 6}
                    className={authTheme.primaryButton}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                    <MoveRight className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}

            {/* ── Step 4: Done ──────────────────────────────────────────── */}
            {step === "done" && (
              <div className="flex flex-col items-center text-center gap-5 py-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50/50">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0f172a]">Password Reset!</h2>
                  <p className="mt-2 text-[15px] text-[#64748b]">
                    Your password has been updated successfully.<br />
                    You can now sign in with your new password.
                  </p>
                </div>
                <Link
                  href="/login"
                  className={`${authTheme.primaryButton} mt-2 max-w-xs`}
                >
                  Go to Login
                  <MoveRight className="h-4 w-4" />
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
