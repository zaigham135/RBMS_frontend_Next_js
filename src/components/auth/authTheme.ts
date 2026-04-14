export function getAuthTheme(dark: boolean) {
  return {
    overlayTitle: dark ? "mt-5 text-center text-[18px] font-semibold text-white" : "mt-5 text-center text-[18px] font-semibold text-[#101828]",
    overlayBody:  dark ? "mt-2 text-center text-[14px] text-white/60"            : "mt-2 text-center text-[14px] text-[#667085]",

    shell: dark
      ? "mx-auto flex h-full max-w-[1200px] items-center justify-center rounded-[26px] border border-white/10 bg-[#111827] px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.4)] lg:px-8 lg:py-6"
      : "mx-auto flex h-full max-w-[1200px] items-center justify-center rounded-[26px] border border-[#d7dfeb] bg-[#f7f9fc] px-4 py-4 shadow-[0_18px_50px_rgba(16,24,40,0.06)] lg:px-8 lg:py-6",

    card: dark
      ? "grid h-full max-h-full w-full max-w-[940px] overflow-hidden rounded-[28px] bg-[#1e293b] shadow-[0_28px_70px_rgba(0,0,0,0.5)] lg:max-h-[680px] lg:grid-cols-[1.02fr_1fr]"
      : "grid h-full max-h-full w-full max-w-[940px] overflow-hidden rounded-[28px] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.08)] lg:max-h-[680px] lg:grid-cols-[1.02fr_1fr]",

    // Left panel stays dark always (it's the branded gradient panel)
    leftPanel: "hidden h-full flex-col justify-between bg-[radial-gradient(circle_at_bottom_left,_rgba(84,60,173,0.28),_transparent_30%),linear-gradient(160deg,#151d35_0%,#11192f_48%,#172544_100%)] px-10 py-9 text-white lg:flex",
    brandText:  "text-[18px] font-semibold tracking-[-0.03em]",
    heroTitle:  "max-w-[300px] text-[32px] font-semibold leading-[1.15] tracking-[-0.05em] text-white",
    heroBody:   "mt-8 max-w-[390px] text-[15px] leading-9 text-white/72",
    heroMeta:   "text-[14px] text-white/78",

    rightPanel: dark
      ? "flex h-full flex-col overflow-hidden bg-[#1e293b] px-7 py-8 sm:px-10 lg:px-12 lg:py-9"
      : "flex h-full flex-col overflow-hidden px-7 py-8 sm:px-10 lg:px-12 lg:py-9",

    title:    dark ? "text-[28px] font-semibold tracking-[-0.04em] text-white"    : "text-[28px] font-semibold tracking-[-0.04em] text-[#0f172a]",
    subtitle: dark ? "mt-3 text-[15px] text-white/50"                             : "mt-3 text-[15px] text-[#64748b]",
    form:     "mt-7 space-y-5",
    label:    dark ? "text-[15px] font-medium text-white/80"                      : "text-[15px] font-medium text-[#0f172a]",

    input: dark
      ? "h-12 w-full rounded-2xl border border-white/15 bg-[#0f172a] pl-11 pr-4 text-[15px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#4c8cff] focus:bg-[#0d1424]"
      : "h-12 w-full rounded-2xl border border-[#dbe3ef] bg-[#fbfcfe] pl-11 pr-4 text-[15px] text-[#0f172a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#8ab1ff] focus:bg-white",

    inputWithToggle: dark
      ? "h-12 w-full rounded-2xl border border-white/15 bg-[#0f172a] pl-11 pr-12 text-[15px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#4c8cff] focus:bg-[#0d1424]"
      : "h-12 w-full rounded-2xl border border-[#dbe3ef] bg-[#fbfcfe] pl-11 pr-12 text-[15px] text-[#0f172a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#8ab1ff] focus:bg-white",

    primaryButton: dark
      ? "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#4c8cff] text-[17px] font-semibold text-white transition-colors hover:bg-[#3a7aee] disabled:cursor-not-allowed disabled:opacity-80"
      : "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#11192f] text-[17px] font-semibold text-white transition-colors hover:bg-[#17213d] disabled:cursor-not-allowed disabled:opacity-80",

    secondaryButton: dark
      ? "flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 text-[16px] font-medium text-white/80 transition-colors hover:border-white/25 hover:bg-white/10"
      : "flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#dbe3ef] bg-white text-[16px] font-medium text-[#334155] transition-colors hover:border-[#bfd2f8] hover:bg-[#f8fbff]",

    dividerLine: dark ? "h-px flex-1 bg-white/10"  : "h-px flex-1 bg-[#e7edf5]",
    dividerText: dark ? "text-[12px] font-medium uppercase tracking-[0.12em] text-white/30" : "text-[12px] font-medium uppercase tracking-[0.12em] text-[#94a3b8]",

    checkboxLabel: dark ? "flex items-center gap-3 text-[15px] text-white/60" : "flex items-center gap-3 text-[15px] text-[#475467]",

    helperText:  dark ? "mt-7 text-center text-[15px] text-white/50"                                    : "mt-7 text-center text-[15px] text-[#64748b]",
    footerLinks: dark ? "mt-3 flex flex-wrap items-center justify-center gap-3 text-[13px] text-white/30" : "mt-3 flex flex-wrap items-center justify-center gap-3 text-[13px] text-[#94a3b8]",
    footerLinkHover: dark ? "hover:text-white/60" : "hover:text-[#64748b]",

    inputIcon: dark ? "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" : "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]",
    eyeButton:  dark ? "absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/70" : "absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] transition-colors hover:text-[#475467]",
  };
}

// Backward-compat static export (light mode) — used by any component not yet migrated
export const authTheme = getAuthTheme(false);
