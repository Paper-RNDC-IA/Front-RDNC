import { GeographicAnalysis } from './GeographicAnalysis';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import { PageIntro } from '../components/common/PageIntro';

export function GeografiaPage(): JSX.Element {
  return (
    <section className="space-y-6 md:space-y-8">
      <DataSourceBadge module="Mapa Interactivo" />
      <PageIntro
        title="Analisis Territorial"
        subtitle="Identifica regiones y corredores con mayor movimiento para orientar decisiones logisticas y priorizacion operacional."
        highlights={[
          'Mapa por capas',
          'Top departamentos',
          'Lectura rapida por territorio',
          'Tooltip con contexto',
        ]}
      />
      <GeographicAnalysis />
    </section>
  );
}
