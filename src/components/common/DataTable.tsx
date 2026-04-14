import { ReactNode, memo } from "react";
import { InboxIcon } from "lucide-react";

interface Column<T> {
  header: string;
  accessor?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
  /** Hide this column on mobile card view */
  mobileHide?: boolean;
  /** Show this column as the card title on mobile */
  mobileTitle?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
}

function getCellValue<T>(row: T, col: Column<T>): ReactNode {
  if (col.cell) return col.cell(row);
  if (col.accessor) return String(row[col.accessor] ?? "—");
  return "—";
}

function DataTableInner<T>({ columns, data, keyExtractor, emptyMessage = "No data available" }: DataTableProps<T>) {
  const empty = (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <InboxIcon className="mb-3 h-10 w-10 opacity-40" />
      <p className="text-sm">{emptyMessage}</p>
    </div>
  );

  return (
    <>
      {/* ── Desktop table (md+) ─────────────────────────────────────── */}
      <div className="hidden md:block w-full overflow-auto rounded-xl border border-[#e3ebf5] dark:border-[#1e293b] bg-white dark:bg-[#0f172a]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e3ebf5] dark:border-[#1e293b] bg-[#f7fbff] dark:bg-[#1e293b]/50">
              {columns.map((col, i) => (
                <th key={i} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#6b7280] dark:text-[#64748b] ${col.className ?? ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={columns.length}>{empty}</td></tr>
            ) : (
              data.map((row) => (
                <tr key={keyExtractor(row)} className="border-b border-[#f0f4f8] dark:border-[#1e293b] last:border-0 transition-colors hover:bg-[#f7fbff]/60 dark:hover:bg-[#1e293b]/40">
                  {columns.map((col, i) => (
                    <td key={i} className={`px-4 py-3 text-[#374151] dark:text-[#cbd5e1] ${col.className ?? ""}`}>
                      {getCellValue(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards (< md) ─────────────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {data.length === 0 ? (
          <div className="rounded-xl border border-[#e3ebf5] dark:border-[#1e293b] bg-white dark:bg-[#0f172a]">
            {empty}
          </div>
        ) : (
          data.map((row) => {
            const titleCol = columns.find(c => c.mobileTitle) ?? columns[0];
            const restCols = columns.filter(c => c !== titleCol && !c.mobileHide);
            return (
              <div key={keyExtractor(row)} className="rounded-xl border border-[#e3ebf5] dark:border-[#1e293b] bg-white dark:bg-[#0f172a] p-4 shadow-sm">
                {/* Card header — title column */}
                <div className="mb-3 pb-3 border-b border-[#f0f4f8] dark:border-[#1e293b]">
                  <div className="text-[13px] font-semibold text-[#374151] dark:text-white">
                    {getCellValue(row, titleCol)}
                  </div>
                </div>
                {/* Remaining fields as label: value rows */}
                <dl className="space-y-2">
                  {restCols.map((col, i) => (
                    <div key={i} className="flex items-start justify-between gap-3">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] dark:text-[#475569] shrink-0 pt-0.5">
                        {col.header}
                      </dt>
                      <dd className="text-[13px] text-[#374151] dark:text-[#cbd5e1] text-right min-w-0">
                        {getCellValue(row, col)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export const DataTable = memo(DataTableInner) as typeof DataTableInner;
