"use client";

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string | null;
  src?: string | null;
  className?: string;
}

export function UserAvatar({ name, src, className }: UserAvatarProps) {
  const initial = (name || "U").trim().charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name || "User avatar"}
        className={cn("h-10 w-10 rounded-full object-cover ring-1 ring-border", className)}
      />
    );
  }

  return (
    <div className={cn(
      "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-1 ring-border",
      className
    )}>
      {initial}
    </div>
  );
}
