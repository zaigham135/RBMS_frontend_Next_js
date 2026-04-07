import { ReactNode, memo } from "react";
import { InboxIcon } from "lucide-react";

interface Column<T> {
  header: string;
  accessor?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
}

function DataTableInner<T>({ columns, data, keyExtractor, emptyMessage = "No data available" }: DataTableProps<T>) {
  return (
    <div className="w-full overflow-auto rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <InboxIcon className="mb-3 h-10 w-10 opacity-40" />
                  <p className="text-sm">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b transition-colors last:border-0 hover:bg-muted/30"
              >
                {columns.map((col, i) => (
                  <td key={i} className={`px-4 py-3 ${col.className ?? ""}`}>
                    {col.cell
                      ? col.cell(row)
                      : col.accessor
                      ? String(row[col.accessor] ?? "—")
                      : "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export const DataTable = memo(DataTableInner) as typeof DataTableInner;
