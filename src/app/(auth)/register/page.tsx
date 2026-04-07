"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register, loginWithGoogle, completeOAuthLogin } = useAuth();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("jwt") || searchParams.get("accessToken");
    const error = searchParams.get("error");

    if (error) {
      toast.error(error);
      return;
    }

    if (!token) return;

    try {
      completeOAuthLogin(searchParams);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign up failed.");
    }
  }, [completeOAuthLogin, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    loginWithGoogle();
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex-col items-center justify-center p-12 text-white">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-8">
          <ClipboardList className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Join TaskFlow</h1>
        <p className="mt-4 text-center text-lg text-white/80 max-w-sm">
          Create your account and start managing tasks efficiently with your team
        </p>
        <ul className="mt-12 space-y-3 w-full max-w-sm">
          {[
            "Collaborate across teams with role-based access",
            "Track project progress in real-time",
            "Get notified on task updates instantly",
            "Manage priorities and deadlines effortlessly",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">✓</span>
              <span className="text-sm text-white/80">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <ClipboardList className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TaskFlow</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Create account</h2>
            <p className="mt-2 text-muted-foreground">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Button type="button" variant="outline" className="w-full h-11 text-base font-semibold" onClick={handleGoogleSignup} disabled={isGoogleLoading || isLoading}>
              {isGoogleLoading ? "Redirecting to Google..." : "Sign up with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or create account with email</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" required autoComplete="name"
                  className="pl-9" placeholder="John Doe"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="reg-email" type="email" required autoComplete="email"
                  className="pl-9" placeholder="you@example.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="reg-password" type={showPass ? "text" : "password"} required
                  className="pl-9 pr-10" placeholder="Min. 8 characters"
                  minLength={8}
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating account...
                </span>
              ) : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
