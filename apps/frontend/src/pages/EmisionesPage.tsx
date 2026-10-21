import { BarChartWidget } from '../components/charts/BarChartWidget';
import { LineChartWidget } from '../components/charts/LineChartWidget';
import { Card } from '../components/common/Card';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import { DataTable } from '../components/common/DataTable';
import { ErrorState } from '../components/common/ErrorState';
import { InsightsPanel } from '../components/common/InsightsPanel';
import { KpiCard } from '../components/common/KpiCard';
import { LoadingState } from '../components/common/LoadingState';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { useEmisionesPage } from '../hooks/useEmisionesPage';
import type { Co2Range } from '../types/emissions';
import { formatDecimal, formatNumber } from '../utils/formatters';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const GRUPO_LABEL: Record<string, string> = {
  tractocamion: 'Tractocamión',
  rigido: 'Camión rígido',
  volqueta: 'Volqueta',
  liviano: 'Camioneta (no estimado)',
  otros: 'Otros (no estimado)',
};

function mt(tons: number): string {
  return `${formatDecimal(tons / 1e6, 2)} Mt`;
}

function rango(r: Co2Range, unit: 'kt' | 'Mt'): string {
  const f =
    unit === 'Mt'
      ? (v: number) => formatDecimal(v / 1e6, 2)
      : (v: number) => formatDecimal(v / 1e3, 0);
  return `${f(r.bajo)} – ${f(r.alto)} ${unit}`;
}

export function EmisionesPage(): JSX.Element {
  const {
    loading,
    error,
    anio,
    overview,
    trend,
    monthly,
    departments,
    municipalities,
    corridors,
    methodology,
    setAnio,
    reload,
  } = useEmisionesPage();

  if (loading && !overview) {
    return <LoadingState title="Calculando emisiones del transporte de carga" />;
  }
  if (error && !overview) {
    return <ErrorState title="Error en emisiones" message={error} onRetry={reload} />;
  }
  if (!overview) {
    return <ErrorState title="Sin datos de emisiones" message="No hay datos." onRetry={reload} />;
  }

  const anios = trend.map((t) => t.anio);
  const prev = trend.find((t) => t.anio === overview.anio - 1);
  const comparable = prev && !prev.parcial && !overview.parcial;
  const dTonKm = comparable ? (overview.ton_km_pesados / prev.ton_km_pesados - 1) * 100 : null;
  const dKm = comparable ? (overview.distancia_media_km / prev.distancia_media_km - 1) * 100 : null;
  const sign = (v: number) => `${v >= 0 ? '+' : ''}${formatDecimal(v, 1)} %`;
  const livianosPct = overview.viajes
    ? (overview.viajes_livianos_y_otros / overview.viajes) * 100
    : 0;

  const trendChart = trend.map((t) => ({
    label: t.parcial ? `${t.anio} (${t.meses} m.)` : String(t.anio),
    value: Math.round(t.co2_t.central / 1e3),
  }));
  const monthlyChart = monthly.map((m) => ({
    label: MESES[m.mes - 1] ?? String(m.mes),
    value: Math.round(m.co2_t_central / 1e3),
  }));
  const deptChart = departments.map((d) => ({
    label: d.territorio,
    value: Math.round(d.co2_t.central / 1e3),
  }));

  const insights = [
    {
      title: `Magnitud estimada ${overview.anio}${overview.parcial ? ' (parcial)' : ''}`,
      detail: `El tramo cargado de los vehículos pesados del RNDC suma ${formatDecimal(overview.ton_km_pesados / 1e9, 1)} mil millones de toneladas-kilómetro y emitiría entre ${rango(overview.co2_t, 'Mt')} de CO₂ (central ${mt(overview.co2_t.central)}).`,
      tone: 'neutral' as const,
    },
    comparable && dTonKm !== null && dKm !== null
      ? {
          title:
            dKm < 0
              ? 'Trayectos más cortos que el año anterior'
              : 'Trayectos más largos que el año anterior',
          detail: `Frente a ${prev.anio}, las toneladas-kilómetro varían ${sign(dTonKm)} y la distancia media ponderada ${sign(dKm)}. La explicación (mezcla de mercancías, rutas o calidad del dato) no está probada.`,
          tone: 'positive' as const,
        }
      : null,
    {
      title: 'Camionetas fuera del cálculo',
      detail: `${formatDecimal(livianosPct, 1)} % de los viajes corresponde a camionetas u otros vehículos livianos: mueven una fracción mínima de las toneladas y tienen otra categoría de factores, por lo que no se estiman.`,
      tone: 'warning' as const,
    },
  ].filter((i): i is NonNullable<typeof i> => Boolean(i));

  return (
    <section className="space-y-6 md:space-y-8">
      <DataSourceBadge
        module="Emisiones del transporte de carga"
        sourceLabel="RNDC público + factores UPME FECOC+"
        sourceDetail="Estimación por distancia (viajes × km × g CO₂/km por tipo de vehículo)"
        visibility="public"
      />
      <PageIntro
        title="Emisiones estimadas del transporte de carga por carretera"
        subtitle="Un indicador territorial que el modelo colombiano de madurez de ciudades inteligentes todavía no tiene: cuánto trabajo de transporte y cuánto CO₂ genera la carga que sale de cada municipio y departamento."
        periodLabel={`${overview.anio}${overview.parcial ? ` · ${overview.meses} meses` : ''}`}
        moduleGuide={{
          summary:
            'Convierte los archivos mensuales del RNDC en toneladas-kilómetro y en una estimación de CO₂ con un rango de incertidumbre.',
          purpose:
            'Dar a municipios, gobernaciones y empresas un indicador con línea base 2022–2025 para la dimensión Hábitat (movilidad inteligente) y Medio ambiente (cambio climático).',
          userType: 'Planeación territorial, autoridades ambientales y de transporte, academia.',
          source:
            'RNDC (Ministerio de Transporte) y factores medidos en ruta por la UPME y la Universidad de Antioquia.',
          analysisType:
            'Estimación basada en distancia, por tipo de vehículo, con escenarios bajo, central y alto.',
          scope:
            'Tramo cargado de camiones, tractocamiones y volquetas. No incluye camionetas ni el regreso en vacío.',
          interpretation:
            'Use el valor central como orden de magnitud y el rango como incertidumbre; compare territorios y años, no cifras absolutas.',
          limitations:
            'No es un inventario de emisiones: el RNDC público no trae combustible consumido ni el tramo de regreso.',
          useCases: [
            'Priorizar corredores y municipios con mayor trabajo de transporte.',
            'Construir una línea base de emisiones de carga para un territorio.',
            'Contrastar la intensidad (g CO₂ por tonelada-km) entre años.',
          ],
        }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <label
          className="text-xs font-medium uppercase tracking-[0.025em] text-[#4a5565]"
          htmlFor="anio-emisiones"
        >
          Año
        </label>
        <select
          id="anio-emisiones"
          className="rounded-lg border border-[#d4d4d4] bg-white px-3 py-2 text-sm"
          value={anio}
          onChange={(e) => setAnio(Number(e.target.value))}
        >
          {anios.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        {overview.parcial ? (
          <span className="rounded-lg border border-[#d4d4d4] px-3 py-1 text-xs text-[#4a5565]">
            Año parcial: {overview.meses} meses. No se compara con años completos.
          </span>
        ) : null}
      </div>

      <SectionHeader
        title="Indicadores del año"
        description="Solo vehículos pesados de carga; el CO₂ se muestra como valor central y rango bajo–alto."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <KpiCard
          item={{
            label: 'CO₂ estimado (central)',
            value: mt(overview.co2_t.central),
            unit: `Rango ${rango(overview.co2_t, 'Mt')}`,
            helperText: 'Tramo cargado; sin regreso en vacío.',
          }}
          sourceLabel="RNDC + UPME"
        />
        <KpiCard
          item={{
            label: 'Toneladas-km',
            value: `${formatDecimal(overview.ton_km_pesados / 1e9, 1)} mil M`,
            delta: dTonKm !== null ? `${sign(dTonKm)} vs ${prev?.anio}` : undefined,
            trend: dTonKm === null ? undefined : dTonKm >= 0 ? 'up' : 'down',
          }}
          sourceLabel="RNDC"
        />
        <KpiCard
          item={{
            label: 'Distancia media (ponderada)',
            value: `${formatDecimal(overview.distancia_media_km, 0)} km`,
            delta: dKm !== null ? `${sign(dKm)} vs ${prev?.anio}` : undefined,
            trend: dKm === null ? undefined : dKm >= 0 ? 'up' : 'down',
            helperText: `Cobertura de distancia: ${formatDecimal(overview.cobertura_distancia_pct, 1)} % de las toneladas.`,
          }}
          sourceLabel="RNDC"
        />
        <KpiCard
          item={{
            label: 'Intensidad',
            value: `${formatDecimal(overview.intensidad_g_por_ton_km.central, 0)} g/t-km`,
            unit: `Rango ${formatDecimal(overview.intensidad_g_por_ton_km.bajo, 0)} – ${formatDecimal(overview.intensidad_g_por_ton_km.alto, 0)} g CO₂ por tonelada-km`,
          }}
          sourceLabel="RNDC + UPME"
        />
      </div>

      <InsightsPanel title="Lectura del periodo" items={insights} />

      <SectionHeader
        title="Evolución y estacionalidad"
        description="La serie 2022–2025 es la línea base que pide el componente de resultados del modelo colombiano."
      />
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <BarChartWidget
          title="CO₂ estimado por año (kt, valor central)"
          subtitle="Los años parciales se rotulan y no se comparan con años completos"
          data={trendChart}
          dataKey="value"
          xKey="label"
          valueLabel="kt CO₂"
          maxItems={8}
          sourceLabel="RNDC + UPME"
          help={{
            description: 'Emisiones estimadas del tramo cargado de vehículos pesados.',
            xAxis: 'Año.',
            yAxis: 'Miles de toneladas de CO₂ (valor central).',
            interpretation:
              'La altura depende del factor elegido; compare la forma de la serie, no el valor absoluto.',
          }}
        />
        <LineChartWidget
          title={`Estacionalidad mensual ${overview.anio} (kt CO₂)`}
          subtitle="Valor central por mes"
          data={monthlyChart}
          dataKey="value"
          xKey="label"
          metricLabel="kt CO₂"
          sourceLabel="RNDC + UPME"
          help={{
            description: 'Variación mensual del CO₂ estimado.',
            xAxis: 'Mes.',
            yAxis: 'Miles de toneladas de CO₂.',
            interpretation: 'Los picos coinciden con los meses de mayor movimiento de carga.',
          }}
        />
      </div>

      <SectionHeader
        title="Dónde se concentra"
        description="Emisiones atribuidas al territorio de donde sale la carga; el rango bajo–alto refleja la incertidumbre del factor."
      />
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        <BarChartWidget
          title="Departamentos de origen (kt CO₂)"
          subtitle="Top 10 por valor central"
          data={deptChart}
          dataKey="value"
          xKey="label"
          horizontal
          sortDescending
          valueLabel="kt CO₂"
          maxItems={10}
          sourceLabel="RNDC + UPME"
          help={{
            description: 'Departamentos con mayor CO₂ estimado por la carga que despachan.',
            xAxis: 'Miles de toneladas de CO₂.',
            yAxis: 'Departamento de origen.',
            interpretation:
              'Un departamento alto puede reflejar un puerto o un centro productivo, no ineficiencia.',
          }}
        />
        <DataTable
          title="Municipios de origen"
          subtitle="Top 10 por CO₂ central, con rango"
          columns={[
            { key: 'territorio', label: 'Municipio' },
            { key: 'viajes', label: 'Viajes' },
            { key: 'co2', label: 'CO₂ (kt, bajo–alto)' },
            { key: 'participacion_pct', label: '% del total' },
          ]}
          rows={municipalities.map((m) => ({
            territorio: m.territorio,
            viajes: formatNumber(m.viajes),
            co2: `${formatDecimal(m.co2_t.central / 1e3, 0)} (${rango(m.co2_t, 'kt').replace(' kt', '')})`,
            participacion_pct: `${formatDecimal(m.participacion_pct, 1)} %`,
          }))}
          rowKey="territorio"
          maxRows={10}
          sourceLabel="RNDC + UPME"
        />
      </div>
      <DataTable
        title="Corredores con mayor CO₂ estimado"
        subtitle="Pares origen–destino de municipios"
        columns={[
          { key: 'ruta', label: 'Corredor' },
          { key: 'viajes', label: 'Viajes' },
          { key: 'ton_km', label: 'Toneladas-km (M)' },
          { key: 'co2', label: 'CO₂ (kt, central y rango)' },
        ]}
        rows={corridors.map((c) => ({
          ruta: `${c.origen} → ${c.destino}`,
          viajes: formatNumber(c.viajes),
          ton_km: formatDecimal(c.ton_km / 1e6, 0),
          co2: `${formatDecimal(c.co2_t.central / 1e3, 0)} (${rango(c.co2_t, 'kt').replace(' kt', '')})`,
        }))}
        rowKey="ruta"
        maxRows={10}
        sourceLabel="RNDC + UPME"
      />

      <SectionHeader
        title="Por tipo de vehículo"
        description="El factor de emisión depende de la configuración del vehículo registrada en el RNDC."
      />
      <DataTable
        title="Trabajo de transporte por grupo"
        columns={[
          { key: 'grupo', label: 'Grupo' },
          { key: 'viajes', label: 'Viajes' },
          { key: 'toneladas', label: 'Toneladas (M)' },
          { key: 'veh_km', label: 'Viajes-km (M)' },
          { key: 'co2', label: 'CO₂ central (kt)' },
        ]}
        rows={overview.por_grupo.map((g) => ({
          grupo: GRUPO_LABEL[g.grupo] ?? g.grupo,
          viajes: formatNumber(g.viajes),
          toneladas: formatDecimal(g.toneladas / 1e6, 2),
          veh_km: formatDecimal(g.veh_km / 1e6, 0),
          co2: g.estimado ? formatDecimal(g.co2_t_central / 1e3, 0) : '—',
        }))}
        rowKey="grupo"
        maxRows={8}
        sourceLabel="RNDC"
      />

      <SectionHeader
        title="Cómo se calcula y qué no dice"
        description="La estimación es útil si se leen sus límites."
      />
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <Card title="Método">
          <p className="text-sm text-[#4a5565]">{methodology?.metodo}</p>
          <p className="mt-3 text-sm text-[#4a5565]">
            <strong>Fuente de los factores:</strong> {methodology?.fuente_factores}
          </p>
          <ul className="mt-3 space-y-1 text-sm text-[#4a5565]">
            {methodology
              ? Object.entries(methodology.factores_g_co2_por_km).map(([g, f]) => (
                  <li key={g}>
                    <strong>{GRUPO_LABEL[g] ?? g}:</strong> {formatDecimal(f.bajo, 0)} –{' '}
                    {formatDecimal(f.alto, 0)} g CO₂/km (central {formatDecimal(f.central, 0)})
                  </li>
                ))
              : null}
          </ul>
        </Card>
        <Card title="Límites">
          <ul className="list-disc space-y-1 pl-5 text-sm text-[#4a5565]">
            {methodology?.limites.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </Card>
      </div>
      <Card title="Relación con el modelo colombiano de madurez de ciudades y territorios inteligentes">
        <p className="text-sm text-[#4a5565]">
          La definición oficial de <strong>movilidad inteligente</strong> (dimensión Hábitat) habla
          de disminuir costos, emisiones de GEI y congestión, y la de{' '}
          <strong>cambio climático</strong> (dimensión Medio ambiente) de mitigar el cambio
          climático. Sin embargo, la batería oficial de indicadores de resultados mide en esas
          subdimensiones solo la mortalidad por accidentes de transporte terrestre y el área
          deforestada. Este indicador se propone como candidato, para discusión; no es un indicador
          oficial. ODS relacionados: {methodology?.ods.join(', ')}.
        </p>
      </Card>
    </section>
  );
}
