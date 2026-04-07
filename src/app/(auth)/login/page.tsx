"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, loginWithGoogle, completeOAuthLogin } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      toast.error(err instanceof Error ? err.message : "Google login failed.");
    }
  }, [completeOAuthLogin, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    loginWithGoogle();
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex-col items-center justify-center p-12 text-white">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-8">
          <ClipboardList className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">TaskFlow</h1>
        <p className="mt-4 text-center text-lg text-white/80 max-w-sm">
          Streamline your team&apos;s workflow with role-based task management
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { label: "Admin Control", desc: "Full system oversight" },
            { label: "Team Projects", desc: "Manage & track projects" },
            { label: "Task Tracking", desc: "Real-time status updates" },
            { label: "Role-Based", desc: "Secure access control" },
          ].map((f) => (
            <div key={f.label} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="font-semibold text-sm">{f.label}</p>
              <p className="text-xs text-white/70 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <ClipboardList className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TaskFlow</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Button type="button" variant="outline" className="w-full h-11 text-base font-semibold" onClick={handleGoogleLogin} disabled={isGoogleLoading || isLoading}>
              {isGoogleLoading ? "Redirecting to Google..." : "Continue with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" required autoComplete="email"
                  className="pl-9" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={showPass ? "text" : "password"} required
                  className="pl-9 pr-10" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
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
                  Signing in...
                </span>
              ) : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
