import { Suspense } from "react";
import { OAuthSuccessClient } from "./OAuthSuccessClient";

export const dynamic = 'force-dynamic';

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#f5f7fb]" />}>
      <OAuthSuccessClient />
    </Suspense>
  );
}
