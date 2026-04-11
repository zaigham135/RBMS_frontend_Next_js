"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CalendarDays, Check, ChevronDown, Download, MoreHorizontal, Search, Settings2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/common/UserAvatar";

type HeaderTab = {
  label: string;
  href?: string;
};

interface NexusTopbarProps {
  title: string;
  searchPlaceholder: string;
  tabs?: HeaderTab[];
  supportLabel?: string;
  docsLabel?: string;
  showUtilityLinks?: boolean;
  userName?: string | null;
  userRole?: string | null;
  userPhoto?: string | null;
  signOutLabel?: string;
}

export function NexusTopbar({
  title,
  searchPlaceholder,
  tabs,
  supportLabel = "Support",
  docsLabel = "Docs",
  showUtilityLinks = true,
  userName,
  userRole,
  userPhoto,
  signOutLabel,
}: NexusTopbarProps) {
  const pathname = usePathname();
  const accountHref = pathname.startsWith("/admin")
    ? "/admin/account"
    : pathname.startsWith("/manager")
      ? "/manager/account"
      : pathname.startsWith("/employee")
        ? "/employee/account"
        : null;

  const avatarNode = (
    <UserAvatar
      name={userName ?? "User"}
      src={userPhoto ?? undefined}
      className="h-10 w-10 ring-0"
    />
  );

  return (
    <div className="flex flex-col gap-4 border-b border-[#e3ebf5] bg-[#f7fbff] dark:bg-[#0f172a] dark:border-[#1e293b] px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-[18px] font-bold tracking-[-0.03em] text-[#101828] lg:text-[20px]">{title}</h1>
          <div className="hidden h-8 w-px bg-[#d9e3ef] lg:block" />
        </div>
        <label className="flex max-w-[320px] flex-1 items-center gap-3 rounded-[18px] bg-[#edf4fa] px-4 py-2.5 text-[#667085] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <Search className="h-4 w-4 shrink-0" />
          <input
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#7b8aa2]"
          />
        </label>
        {tabs?.length ? (
          <nav className="flex items-center gap-5 text-[14px] font-medium text-[#667085]">
            {tabs.map((tab) => {
              const isActive = tab.href ? pathname === tab.href : false;
              const className = cn(
                "border-b-2 pb-2 transition-colors",
                isActive ? "border-[#1c56d9] text-[#1c56d9]" : "border-transparent hover:text-[#344054]"
              );

              if (!tab.href) {
                return <span key={tab.label} className={className}>{tab.label}</span>;
              }

              return (
                <Link key={tab.href} href={tab.href} className={className}>
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4 lg:justify-end">
        <div className="hidden items-center gap-6 text-[14px] text-[#51607a] lg:flex">
          {!tabs?.length && showUtilityLinks ? (
            <>
              {supportLabel ? <span>{supportLabel}</span> : null}
              {docsLabel ? <span>{docsLabel}</span> : null}
            </>
          ) : null}
          <div className="flex items-center gap-5 border-l border-[#d9e3ef] pl-7">
            <div className="relative">
              <Bell className="h-4 w-4 text-[#51607a]" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#d14343]" />
            </div>
            <Settings2 className="h-4 w-4 text-[#51607a]" />
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-[#d9e3ef] pl-4">
          {accountHref ? (
            <Link
              href={accountHref}
              aria-label="Open profile details"
              className="flex items-center gap-3 rounded-[18px] px-2 py-1 transition-colors hover:bg-[#f4f8fc]"
            >
              {avatarNode}
              {signOutLabel ? null : (
                <div className="text-right leading-tight">
                  <div className="text-[14px] font-semibold text-[#111827]">{userName ?? "Alex Rivera"}</div>
                  <div className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">{userRole ?? "Workspace"}</div>
                </div>
              )}
            </Link>
          ) : (
            <>
              {avatarNode}
              {signOutLabel ? null : (
                <div className="text-right leading-tight">
                  <div className="text-[14px] font-semibold text-[#111827]">{userName ?? "Alex Rivera"}</div>
                  <div className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">{userRole ?? "Workspace"}</div>
                </div>
              )}
            </>
          )}
          {signOutLabel ? (
            <span className="text-[15px] font-medium text-[#111827]">{signOutLabel}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function NexusPageIntro({
  eyebrow,
  title,
  description,
  actions,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-col lg:flex-row lg:items-start lg:justify-between", compact ? "gap-4" : "gap-6")}>
      <div>
        {eyebrow ? (
          <div className={cn("font-semibold uppercase tracking-[0.18em] text-[#4c5667]", compact ? "mb-1.5 text-[11px]" : "mb-2 text-xs")}>{eyebrow}</div>
        ) : null}
        <h2 className={cn("font-bold tracking-[-0.05em] text-[#1b2632]", compact ? "text-[26px] lg:text-[30px]" : "text-[34px] lg:text-[42px]")}>{title}</h2>
        <p className={cn("max-w-3xl text-[#4c5667]", compact ? "mt-2 text-[14px] leading-7" : "mt-3 text-[16px] leading-8")}>{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function ActionButton({
  children,
  icon: Icon,
  variant = "secondary",
  size = "default",
  className,
  href,
  onClick,
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "dark";
  size?: "default" | "compact";
  className?: string;
  href?: string;
  onClick?: () => void;
}) {
  const styles = cn(
    "inline-flex items-center rounded-[18px] font-semibold shadow-sm transition-transform hover:-translate-y-0.5",
    size === "compact" ? "gap-2 rounded-[14px] px-4 py-2.5 text-[13px]" : "gap-2.5 px-5 py-3 text-[15px]",
    variant === "primary" && "bg-[#1557d6] text-white hover:bg-[#1248b3]",
    variant === "secondary" && "bg-[#edf4fa] text-[#1f2937] dark:bg-[#1e293b] dark:text-[#f1f5f9] dark:border dark:border-[#334155]",
    variant === "dark" && "bg-[#1b2238] text-white",
    className
  );

  const content = (
    <>
      {Icon ? <Icon className={size === "compact" ? "h-3.5 w-3.5" : "h-4 w-4"} /> : null}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles}
    >
      {content}
    </button>
  );
}

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn(
      "rounded-[24px] border border-[#e6edf5] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)]",
      "dark:border-[#334155] dark:bg-[#1e293b] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)]",
      className
    )}>
      {children}
    </section>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  note,
  badge,
  iconClassName,
  cardClassName,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  note?: string;
  badge?: string;
  iconClassName?: string;
  cardClassName?: string;
}) {
  return (
    <Panel className={cn("p-6", cardClassName)}>
      <div className="flex items-start justify-between gap-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#edf4fa] text-[#47617f] dark:bg-[#1e3a5f] dark:text-[#93c5fd]", iconClassName)}>
          <Icon className="h-6 w-6" />
        </div>
        {badge ? <Pill className="bg-[#ece9ff] px-3 py-1 text-xs font-semibold text-[#61538e] dark:bg-[#2e1065] dark:text-[#c4b5fd]">{badge}</Pill> : null}
      </div>
      <div className="mt-6 space-y-1">
        <div className="text-[14px] font-medium text-[#475467] dark:text-[#94a3b8]">{label}</div>
        <div className="text-[38px] font-bold tracking-[-0.05em] text-[#1f2937] dark:text-[#f1f5f9]">{value}</div>
        {note ? <div className="pt-2 text-[14px] text-[#667085] dark:text-[#64748b]">{note}</div> : null}
      </div>
    </Panel>
  );
}

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold", className)}>
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  className,
  trackClassName,
  barClassName,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
}) {
  return (
    <div className={cn("h-2.5 w-full rounded-full bg-[#e4edf6]", trackClassName, className)}>
      <div className={cn("h-full rounded-full bg-[#1859db]", barClassName)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <h3 className="text-[21px] font-bold tracking-[-0.03em] text-[#1f2937]">{title}</h3>
        {subtitle ? <p className="mt-1 text-[14px] text-[#667085]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function DataTableShell({
  title,
  countLabel,
  controls,
  columns,
  children,
  footer,
  compact = false,
}: {
  title: string;
  countLabel?: string;
  controls?: React.ReactNode;
  columns: string[];
  children: React.ReactNode;
  footer?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <Panel className="overflow-hidden">
      <div className={cn(
        "flex flex-col border-b border-[#edf2f7] bg-white dark:border-[#334155] dark:bg-[#1e293b] lg:flex-row lg:items-center lg:justify-between",
        compact ? "gap-4 px-6 py-5" : "gap-5 px-8 py-8"
      )}>
        <div className="flex items-center gap-4">
          <span className={cn("rounded-full bg-[#1a57d7]", compact ? "h-6 w-1.5" : "h-8 w-2")} />
          <h3 className={cn("font-bold tracking-[-0.03em] text-[#1f2937] dark:text-[#f1f5f9]", compact ? "text-[18px]" : "text-[22px]")}>{title}</h3>
        </div>
        <div className={cn("flex items-center gap-5 text-[#556274] dark:text-[#94a3b8]", compact ? "text-[13px]" : "text-[15px]")}>
          {countLabel ? <span>{countLabel}</span> : null}
          {controls}
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className={cn(
          "grid min-w-[900px] grid-cols-12 bg-[#eef4f9] dark:bg-[#1e293b] font-bold uppercase tracking-[0.16em] text-[#4f5b67] dark:text-[#64748b]",
          compact ? "px-6 py-4 text-[11px]" : "px-8 py-5 text-sm"
        )}>
          {columns.map((column) => (
            <div key={column} className="col-span-2 first:col-span-3">
              {column}
            </div>
          ))}
        </div>
        <div>{children}</div>
      </div>
      {footer ? <div className={cn("border-t border-[#edf2f7] dark:border-[#334155]", compact ? "px-6 py-4" : "px-8 py-6")}>{footer}</div> : null}
    </Panel>
  );
}

export function PaginationDisplay({
  page,
  total,
  onPageChange,
  compact = false,
}: {
  page: number;
  total: number;
  onPageChange?: (page: number) => void;
  compact?: boolean;
}) {
  const pages = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <div className={cn("flex items-center gap-2 text-[#1f2937]", compact ? "text-[14px]" : "gap-3 text-lg")}>
      <button
        type="button"
        onClick={() => onPageChange?.(Math.max(1, page - 1))}
        className={cn(
          "flex items-center justify-center border border-[#edf2f7] dark:border-[#334155] text-[#98a2b3] dark:text-[#64748b] dark:bg-[#1e293b]",
          compact ? "h-9 w-9 rounded-xl" : "h-12 w-12 rounded-2xl"
        )}
      >
        <ChevronDown className="h-4 w-4 rotate-90" />
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPageChange?.(item)}
          className={cn(
            compact ? "flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-[14px]" : "flex h-12 min-w-12 items-center justify-center rounded-2xl px-4 text-lg",
            item === page
              ? "bg-[#1557d6] font-semibold text-white"
              : "text-[#1f2937] dark:text-[#94a3b8] dark:hover:bg-[#334155]"
          )}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange?.(Math.min(total, page + 1))}
        className={cn(
          "flex items-center justify-center border border-[#edf2f7] dark:border-[#334155] text-[#1f2937] dark:text-[#94a3b8] dark:bg-[#1e293b]",
          compact ? "h-9 w-9 rounded-xl" : "h-12 w-12 rounded-2xl"
        )}
      >
        <ChevronDown className="h-4 w-4 -rotate-90" />
      </button>
    </div>
  );
}

export function SoftIconButton({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <button type="button" className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-[#495667] transition-colors hover:bg-[#eff4fb]", className)}>
      <Icon className="h-5 w-5" />
    </button>
  );
}

export function MiniCalendarChip({ label }: { label: string }) {
  return (
    <ActionButton icon={CalendarDays} variant="secondary">
      {label}
    </ActionButton>
  );
}

export function ExportChip({ label }: { label: string }) {
  return (
    <ActionButton icon={Download} variant="secondary">
      {label}
    </ActionButton>
  );
}

export function LegendPill({
  label,
  dotClassName,
}: {
  label: string;
  dotClassName: string;
}) {
  return (
    <Pill className="bg-[#edf4fa] px-4 py-2 text-sm font-bold uppercase tracking-[0.03em] text-[#1f2937]">
      <span className={cn("h-2.5 w-2.5 rounded-full", dotClassName)} />
      {label}
    </Pill>
  );
}

export function ActivityItem({
  title,
  description,
  meta,
  dotClassName,
}: {
  title: string;
  description: string;
  meta: string;
  dotClassName: string;
}) {
  return (
    <div className="flex gap-4">
      <span className={cn("mt-2 h-2.5 w-2.5 shrink-0 rounded-full", dotClassName)} />
      <div className="space-y-1">
        <div className="text-[18px] font-semibold text-[#1f2937]">{title}</div>
        <div className="max-w-xs text-[15px] leading-7 text-[#556274]">{description}</div>
        <div className="text-sm text-[#7b8794]">{meta}</div>
      </div>
    </div>
  );
}

export function ResourceBars({
  items,
}: {
  items: { label: string; value: number; colorClassName?: string }[];
}) {
  return (
    <div className="space-y-8">
      {items.map((item) => (
        <div key={item.label} className="space-y-3">
          <div className="flex items-center justify-between text-[16px] font-semibold text-[#1f2937]">
            <span>{item.label}</span>
            <span className="text-[#1557d6]">{item.value}%</span>
          </div>
          <ProgressBar value={item.value} barClassName={item.colorClassName ?? "bg-[#1557d6]"} />
        </div>
      ))}
    </div>
  );
}

export function EmptySkeletonBlock() {
  return (
    <div className="space-y-5">
      <div className="h-12 w-12 rounded-xl bg-[#edf2f7]" />
      <div className="h-5 w-4/5 rounded-full bg-[#edf2f7]" />
      <div className="h-5 w-2/3 rounded-full bg-[#edf2f7]" />
      <div className="mt-10 h-2 w-full rounded-full bg-[#edf2f7]" />
    </div>
  );
}

export function CheckAction() {
  return <Check className="h-5 w-5 text-[#1557d6]" />;
}

export function MoreButton() {
  return <MoreHorizontal className="h-5 w-5 text-[#4b5563]" />;
}
