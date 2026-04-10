import { GeographicAnalysis } from './GeographicAnalysis';
import { SectionLegend } from '../components/common/SectionLegend';
import { DataSourceBadge } from '../components/common/DataSourceBadge';

export function GeografiaPage(): JSX.Element {
  return (
    <section className="space-y-4">
      <DataSourceBadge
        module="Mapa Interactivo"
        endpoints={[
          '/api/routes/kpis',
          '/api/routes/production-map',
          '/api/routes/demand-map',
          '/api/routes/royalties-map',
        ]}
      />
      <SectionLegend
        title="Leyenda de Mapa Interactivo"
        items={[
          {
            label: 'Capas',
            description: 'Alterna entre produccion, regalias y demanda territorial.',
          },
          {
            label: 'Intensidad de color',
            description: 'Representa magnitud relativa del indicador por departamento.',
          },
          {
            label: 'Seleccion de departamento',
            description: 'Despliega detalle del territorio en el panel lateral.',
          },
          {
            label: 'Controles de vista',
            description: 'Permiten acercar, alejar y reiniciar la vista del mapa.',
          },
        ]}
      />
      <GeographicAnalysis />
    </section>
  );
}
