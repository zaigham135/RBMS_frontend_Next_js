"use client";

import { Suspense, ReactNode } from "react";

export function SearchParamsWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#f5f7fb]" />}>
      {children}
    </Suspense>
  );
}
