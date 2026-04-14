"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken, getRole, getDashboardPath } from "@/lib/auth";
import {
  SquareStack,
  CheckCircle2,
  Users,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Star,
  ChevronRight,
  Calendar,
  Bell,
  Layout,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    const role = getRole();
    if (token && role) {
      router.replace(getDashboardPath(role));
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b1120]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4c8cff] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#0b1120]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4c8cff] shadow-[0_8px_20px_rgba(76,140,255,0.4)]">
              <SquareStack className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-[17px] font-semibold tracking-tight">TaskMan</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-[14px] text-white/60 transition-colors hover:text-white">Features</a>
            <a href="#roles" className="text-[14px] text-white/60 transition-colors hover:text-white">Roles</a>
            <a href="#stats" className="text-[14px] text-white/60 transition-colors hover:text-white">Why Us</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[14px] font-medium text-white/70 transition-colors hover:text-white">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-[#4c8cff] px-4 py-2 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(76,140,255,0.4)] transition-all hover:bg-[#3a7aee] hover:shadow-[0_6px_20px_rgba(76,140,255,0.5)]"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4c8cff]/10 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-[300px] w-[300px] rounded-full bg-[#7c66ff]/8 blur-[80px]" />
        </div>

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4c8cff]/30 bg-[#4c8cff]/10 px-4 py-1.5">
          <Zap className="h-3.5 w-3.5 text-[#4c8cff]" />
          <span className="text-[13px] font-medium text-[#4c8cff]">Role-Based Task Management</span>
        </div>

        <h1 className="relative max-w-3xl text-[52px] font-bold leading-[1.1] tracking-[-0.04em] sm:text-[64px]">
          Manage Tasks.
          <br />
          <span className="bg-gradient-to-r from-[#4c8cff] via-[#7c66ff] to-[#a78bfa] bg-clip-text text-transparent">
            Empower Teams.
          </span>
        </h1>

        <p className="relative mt-6 max-w-xl text-[17px] leading-relaxed text-white/55">
          TaskMan gives Admins, Managers, and Employees the right tools for their role — so your team stays aligned, productive, and always moving forward.
        </p>

        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-2xl bg-[#4c8cff] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_30px_rgba(76,140,255,0.45)] transition-all hover:bg-[#3a7aee] hover:shadow-[0_12px_40px_rgba(76,140,255,0.55)]"
          >
            Start for free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 text-[15px] font-semibold text-white backdrop-blur transition-all hover:border-white/25 hover:bg-white/10"
          >
            Sign in <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Social proof */}
        <div className="relative mt-12 flex flex-wrap items-center justify-center gap-6 text-[13px] text-white/40">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {["#f08a77","#56b6ff","#7c66ff","#4ade80"].map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} className="h-7 w-7 rounded-full border-2 border-[#0b1120]" />
              ))}
            </div>
            <span>2,000+ teams</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[#fbbf24] text-[#fbbf24]" />)}
            <span className="ml-1">4.9 / 5</span>
          </div>
          <span>No credit card required</span>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mt-16 w-full max-w-4xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#4c8cff]/20 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 border-b border-white/8 bg-[#0d1424] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto flex h-6 w-64 items-center justify-center rounded-md bg-white/5 text-[11px] text-white/30">
                my-rbms.vercel.app/manager
              </div>
            </div>
            {/* Fake dashboard UI */}
            <div className="grid grid-cols-[200px_1fr] divide-x divide-white/8">
              {/* Sidebar */}
              <div className="hidden space-y-1 bg-[#0d1424] p-4 sm:block">
                <div className="mb-4 flex items-center gap-2 px-2">
                  <div className="h-7 w-7 rounded-lg bg-[#4c8cff]" />
                  <div className="h-3 w-20 rounded bg-white/20" />
                </div>
                {["Dashboard","Tasks","Projects","Calendar","Team"].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${i === 1 ? "bg-[#4c8cff]/20" : ""}`}>
                    <div className={`h-3.5 w-3.5 rounded ${i === 1 ? "bg-[#4c8cff]" : "bg-white/20"}`} />
                    <div className={`h-2.5 rounded ${i === 1 ? "w-10 bg-[#4c8cff]" : "w-14 bg-white/15"}`} />
                  </div>
                ))}
              </div>
              {/* Main content */}
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-4 w-32 rounded bg-white/20" />
                  <div className="h-7 w-24 rounded-lg bg-[#4c8cff]/30" />
                </div>
                {/* Stat cards */}
                <div className="mb-4 grid grid-cols-3 gap-3">
                  {[["#4c8cff","12","Active Tasks"],["#7c66ff","4","In Review"],["#4ade80","8","Completed"]].map(([color, num, label]) => (
                    <div key={label} className="rounded-xl border border-white/8 bg-white/5 p-3">
                      <div className="text-[20px] font-bold" style={{ color }}>{num}</div>
                      <div className="mt-0.5 text-[11px] text-white/40">{label}</div>
                    </div>
                  ))}
                </div>
                {/* Task rows */}
                <div className="space-y-2">
                  {[["#4c8cff","Design review","In Progress",75],["#7c66ff","API integration","In Review",45],["#4ade80","Unit tests","Completed",100],["#fbbf24","Documentation","Pending",20]].map(([color, name, status, pct]) => (
                    <div key={name} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/4 px-3 py-2.5">
                      <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: color as string }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-white/80 truncate">{name}</div>
                        <div className="mt-1 h-1 w-full rounded-full bg-white/10">
                          <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: color as string }} />
                        </div>
                      </div>
                      <div className="text-[10px] text-white/40 flex-shrink-0">{status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <section id="stats" className="border-y border-white/8 bg-white/3 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 sm:grid-cols-4">
          {[["2,000+","Teams using TaskMan"],["98%","Task completion rate"],["3 Roles","Admin · Manager · Employee"],["<1s","Average response time"]].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-[32px] font-bold tracking-tight text-white">{val}</div>
              <div className="mt-1 text-[13px] text-white/45">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#4c8cff]/30 bg-[#4c8cff]/10 px-4 py-1.5">
              <span className="text-[13px] font-medium text-[#4c8cff]">Everything you need</span>
            </div>
            <h2 className="text-[38px] font-bold tracking-tight">Built for how teams actually work</h2>
            <p className="mt-4 text-[16px] text-white/50">Every feature is designed around real workflows — not the other way around.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: CheckCircle2, color: "#4c8cff", bg: "rgba(76,140,255,0.12)", title: "Smart Task Tracking", desc: "Create, assign, and track tasks with priorities, deadlines, and real-time status updates across your entire team." },
              { icon: Users, color: "#7c66ff", bg: "rgba(124,102,255,0.12)", title: "Role-Based Access", desc: "Admins manage users, Managers oversee projects, Employees focus on their work. Everyone sees exactly what they need." },
              { icon: BarChart3, color: "#4ade80", bg: "rgba(74,222,128,0.12)", title: "Progress Analytics", desc: "Visual dashboards show task completion rates, team velocity, and project health at a glance." },
              { icon: Calendar, color: "#fbbf24", bg: "rgba(251,191,36,0.12)", title: "Calendar View", desc: "See all deadlines and milestones in a calendar layout. Never miss a due date again." },
              { icon: Bell, color: "#f472b6", bg: "rgba(244,114,182,0.12)", title: "Activity Logs", desc: "Full audit trail of every action — who did what and when. Stay informed without micromanaging." },
              { icon: Shield, color: "#34d399", bg: "rgba(52,211,153,0.12)", title: "Secure by Default", desc: "JWT authentication, role-based permissions, and encrypted data keep your team's work safe." },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-white/8 bg-white/4 p-6 transition-all hover:border-white/15 hover:bg-white/7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: bg }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <h3 className="text-[16px] font-semibold text-white">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ──────────────────────────────────────────────────────── */}
      <section id="roles" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-[38px] font-bold tracking-tight">One platform, three perspectives</h2>
            <p className="mt-4 text-[16px] text-white/50">Each role gets a tailored experience — the right data, the right controls.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                role: "Admin",
                color: "#a78bfa",
                border: "border-[#a78bfa]/30",
                glow: "rgba(167,139,250,0.15)",
                icon: Shield,
                perks: ["Manage all users & roles","Full system oversight","View all projects & tasks","Configure platform settings","Access complete audit logs"],
                desc: "Full control over the platform. Manage users, assign roles, and keep the entire organization running smoothly.",
              },
              {
                role: "Manager",
                color: "#4c8cff",
                border: "border-[#4c8cff]/40",
                glow: "rgba(76,140,255,0.18)",
                icon: Layout,
                perks: ["Create & manage projects","Assign tasks to employees","Track team progress","Review & approve work","Generate team reports"],
                desc: "Lead your team with confidence. Create projects, assign work, and monitor progress — all in one place.",
                featured: true,
              },
              {
                role: "Employee",
                color: "#4ade80",
                border: "border-[#4ade80]/30",
                glow: "rgba(74,222,128,0.12)",
                icon: CheckCircle2,
                perks: ["View assigned tasks","Update task status","Track personal progress","Collaborate with team","Access project calendar"],
                desc: "Stay focused on what matters. See your tasks, update progress, and collaborate without the noise.",
              },
            ].map(({ role, color, border, glow, icon: Icon, perks, desc, featured }) => (
              <div
                key={role}
                className={`relative rounded-2xl border ${border} p-7 transition-all hover:scale-[1.02]`}
                style={{ background: `radial-gradient(circle at top left, ${glow}, transparent 60%), rgba(255,255,255,0.03)` }}
              >
                {featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#4c8cff] px-4 py-1 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(76,140,255,0.5)]">
                    Most Popular
                  </div>
                )}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}20` }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <h3 className="text-[22px] font-bold" style={{ color }}>{role}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/50">{desc}</p>
                <ul className="mt-5 space-y-2.5">
                  {perks.map(p => (
                    <li key={p} className="flex items-center gap-2.5 text-[14px] text-white/70">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#4c8cff]/25 bg-gradient-to-br from-[#111d3a] to-[#0d1424] p-12 text-center shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4c8cff]/15 blur-[60px]" />
          </div>
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4c8cff]/30 bg-[#4c8cff]/10 px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 text-[#4c8cff]" />
              <span className="text-[13px] font-medium text-[#4c8cff]">Free to get started</span>
            </div>
            <h2 className="text-[38px] font-bold tracking-tight">Ready to take control?</h2>
            <p className="mt-4 text-[16px] text-white/55">
              Join thousands of teams already using TaskMan to ship faster, collaborate better, and stay organized.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-2xl bg-[#4c8cff] px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_30px_rgba(76,140,255,0.45)] transition-all hover:bg-[#3a7aee]"
              >
                Create your account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-white/15 px-8 py-3.5 text-[15px] font-semibold text-white/80 transition-all hover:border-white/30 hover:text-white"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 py-10 px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4c8cff]">
              <SquareStack className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[15px] font-semibold">TaskMan</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-white/40">
            <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link>
            <Link href="/help-center" className="hover:text-white/70 transition-colors">Help Center</Link>
          </div>
          <p className="text-[13px] text-white/30">© 2025 TaskMan. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
