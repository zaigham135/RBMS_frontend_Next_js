import { Sidebar } from "@/components/common/Sidebar";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f7fbff] dark:bg-[#0f172a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full animate-in fade-in-0 duration-200">{children}</div>
      </main>
    </div>
  );
}
