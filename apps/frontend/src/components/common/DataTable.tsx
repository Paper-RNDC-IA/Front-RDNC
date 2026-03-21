import { Card } from './Card';

type Column<T extends object> = {
  key: keyof T & string;
  label: string;
};

type DataTableProps<T extends object> = {
  title: string;
  columns: Array<Column<T>>;
  rows: T[];
  rowKey: keyof T & string;
  onRowClick?: (row: T) => void;
};

export function DataTable<T extends object>({
  title,
  columns,
  rows,
  rowKey,
  onRowClick,
}: DataTableProps<T>): JSX.Element {
  return (
    <Card title={title}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-2 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={String(row[rowKey])}
                className="border-b border-slate-900 text-slate-200 transition-colors hover:bg-slate-800/40"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => {
                  const value = row[column.key];

                  return (
                    <td key={`${String(row[rowKey])}-${column.key}`} className="px-3 py-2">
                      {typeof value === 'string' || typeof value === 'number' ? value : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
