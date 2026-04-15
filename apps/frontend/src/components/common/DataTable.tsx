import { Card } from './Card';
import { MetricInfoTooltip } from './MetricInfoTooltip';

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
  sourceLabel?: string;
  helpText?: string;
};

export function DataTable<T extends object>({
  title,
  columns,
  rows,
  rowKey,
  onRowClick,
  subtitle,
  maxRows = 10,
  sourceLabel,
  helpText,
}: DataTableProps<T>): JSX.Element {
  const visibleRows = rows.slice(0, maxRows);

  return (
    <Card
      className="bg-gradient-to-b from-white to-[#fffaf6]"
      title={title}
      actions={
        <div className="flex items-center gap-2">
          {sourceLabel ? (
            <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm">
              Fuente: {sourceLabel}
            </span>
          ) : null}
          {helpText ? (
            <MetricInfoTooltip
              label={`Ayuda: ${title}`}
              meaning={helpText}
              interpretation="Utiliza la tabla para comparar valores entre filas y detectar concentraciones o anomalias."
              source={sourceLabel}
            />
          ) : null}
        </div>
      }
    >
      {subtitle ? <p className="mb-3 text-xs text-slate-500">{subtitle}</p> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-zinc-200 text-slate-600">
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
                <td colSpan={columns.length} className="px-3 py-5 text-center text-slate-500">
                  No hay registros para este rango.
                </td>
              </tr>
            ) : null}
            {visibleRows.map((row) => (
              <tr
                key={String(row[rowKey])}
                className="border-b border-zinc-200/70 text-slate-700 transition-colors hover:bg-orange-50/45"
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
        <p className="mt-3 text-xs text-slate-500">
          Mostrando Top {maxRows} de {rows.length} registros.
        </p>
      ) : null}
    </Card>
  );
}
