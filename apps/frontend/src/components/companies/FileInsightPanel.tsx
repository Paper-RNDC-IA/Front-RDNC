import type { ChartDatum, KpiItem, SummaryItem } from '../../types/common';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { KpiCard } from '../common/KpiCard';
import { LineChartWidget } from '../charts/LineChartWidget';
import { PieChartWidget } from '../charts/PieChartWidget';

type FileInsightPanelProps = {
  fileName: string | null;
  loading: boolean;
  kpis: KpiItem[];
  trendData: ChartDatum[];
  categoriesData: ChartDatum[];
  notes: SummaryItem[];
  onExportCsv: () => Promise<void>;
  onExportExcel: () => Promise<void>;
  onExportPdf: () => Promise<void>;
};

export function FileInsightPanel({
  fileName,
  loading,
  kpis,
  trendData,
  categoriesData,
  notes,
  onExportCsv,
  onExportExcel,
  onExportPdf,
}: FileInsightPanelProps): JSX.Element {
  if (!fileName) {
    return (
      <EmptyState
        title="Sin archivo seleccionado"
        message="Selecciona un archivo de la tabla para ver analitica y reportes."
      />
    );
  }

  if (loading) {
    return (
      <Card title="Analitica del archivo seleccionado">
        <p className="text-sm text-slate-400">Cargando analitica del archivo...</p>
      </Card>
    );
  }

  return (
    <section id="company-insight-panel" className="space-y-4">
      <Card
        title="Analitica del archivo seleccionado"
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void onExportCsv()}
              className="rounded-md bg-slate-700 px-2 py-1 text-xs text-slate-100 hover:bg-slate-600"
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => void onExportExcel()}
              className="rounded-md bg-orange-700 px-2 py-1 text-xs text-white hover:bg-orange-600"
            >
              Excel
            </button>
            <button
              type="button"
              onClick={() => void onExportPdf()}
              className="rounded-md bg-amber-700 px-2 py-1 text-xs text-white hover:bg-amber-600"
            >
              PDF
            </button>
          </div>
        }
      >
        <p className="text-xs text-slate-400">Archivo: {fileName}</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} sourceLabel="Telemetria empresarial" />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <LineChartWidget
          title="Tendencia de registros"
          data={trendData}
          dataKey="value"
          xKey="label"
          sourceLabel="Telemetria empresarial"
          help={{
            description: 'Muestra variacion temporal de registros del archivo seleccionado.',
            xAxis: 'Periodo del archivo.',
            yAxis: 'Cantidad de registros validos.',
            interpretation:
              'Permite detectar picos o caidas en la captura de datos del archivo empresarial.',
          }}
        />
        <PieChartWidget
          title="Distribucion por categoria"
          data={categoriesData}
          dataKey="value"
          nameKey="label"
          sourceLabel="Telemetria empresarial"
          help={{
            description: 'Distribuye el archivo por categorias para evaluar composicion del dato.',
            xAxis: 'Categoria detectada.',
            yAxis: 'Participacion en el total del archivo.',
            interpretation:
              'Categorias predominantes indican el tipo de comportamiento mas frecuente en el archivo.',
          }}
        />
      </div>

      <Card title="Hallazgos de analisis">
        <ul className="space-y-2 text-sm text-slate-300">
          {notes.map((item) => (
            <li key={item.label} className="rounded-md bg-slate-950/60 px-3 py-2">
              {item.value}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
