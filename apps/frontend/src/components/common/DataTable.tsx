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
  subtitle?: string;
  maxRows?: number;
};

export function DataTable<T extends object>({
  title,
  columns,
  rows,
  rowKey,
  onRowClick,
  subtitle,
  maxRows = 10,
}: DataTableProps<T>): JSX.Element {
  const visibleRows = rows.slice(0, maxRows);

  return (
    <Card title={title}>
      {subtitle ? <p className="mb-3 text-xs text-slate-400">{subtitle}</p> : null}
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
            {!visibleRows.length ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-5 text-center text-slate-400">
                  No hay registros para este rango.
                </td>
              </tr>
            ) : null}
            {visibleRows.map((row) => (
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
      {rows.length > maxRows ? (
        <p className="mt-3 text-xs text-slate-400">
          Mostrando Top {maxRows} de {rows.length} registros.
        </p>
      ) : null}
    </Card>
  );
}
