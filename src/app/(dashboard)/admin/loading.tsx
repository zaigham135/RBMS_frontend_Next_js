export default function AdminLoading() {
  return (
    <div className="min-h-full animate-pulse bg-[#f7fbff]">
      {/* Topbar skeleton */}
      <div className="flex items-center justify-between border-b border-[#e3ebf5] bg-[#f7fbff] px-6 py-4">
        <div className="space-y-2">
          <div className="h-5 w-32 rounded-full bg-[#edf2f7]" />
          <div className="h-3.5 w-56 rounded-full bg-[#edf2f7]" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-48 rounded-[14px] bg-[#edf2f7]" />
          <div className="h-9 w-9 rounded-full bg-[#edf2f7]" />
          <div className="h-9 w-36 rounded-[16px] bg-[#edf2f7]" />
        </div>
      </div>

      <div className="space-y-6 px-6 py-6">
        {/* Stats skeleton */}
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[24px] border border-[#e6edf5] bg-white p-6">
              <div className="h-12 w-12 rounded-[18px] bg-[#edf2f7]" />
              <div className="mt-6 space-y-2">
                <div className="h-3.5 w-24 rounded-full bg-[#edf2f7]" />
                <div className="h-8 w-16 rounded-full bg-[#edf2f7]" />
              </div>
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="rounded-[24px] border border-[#e6edf5] bg-white">
          <div className="border-b border-[#edf2f7] px-6 py-4">
            <div className="h-5 w-40 rounded-full bg-[#edf2f7]" />
          </div>
          <div className="px-6 py-3">
            <div className="grid grid-cols-12 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="col-span-2 h-3 rounded-full bg-[#edf2f7]" />
              ))}
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 items-center gap-4 border-t border-[#edf2f7] px-6 py-4">
              <div className="col-span-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#edf2f7]" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 rounded-full bg-[#edf2f7]" />
                  <div className="h-3 w-20 rounded-full bg-[#edf2f7]" />
                </div>
              </div>
              <div className="col-span-3 h-3.5 w-24 rounded-full bg-[#edf2f7]" />
              <div className="col-span-2 h-3.5 w-20 rounded-full bg-[#edf2f7]" />
              <div className="col-span-2 h-6 w-16 rounded-full bg-[#edf2f7]" />
              <div className="col-span-2 h-6 w-20 rounded-full bg-[#edf2f7]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
