import { Suspense } from "react";
import { RegisterClient } from "./RegisterClient";

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#f5f7fb]" />}>
      <RegisterClient />
    </Suspense>
  );
}
