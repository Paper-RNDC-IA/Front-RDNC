import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getEmissionsOverview } from '../services/emissions.service';
import type { EmissionsOverviewApi } from '../types/emissions';
import { formatDecimal } from '../utils/formatters';

const problems = [
  {
    title: 'Un vacío en el modelo nacional',
    description:
      'El modelo de madurez de ciudades y territorios inteligentes del MinTIC define la movilidad inteligente por menos emisiones de GEI y congestión, pero su batería de indicadores de resultados solo mide mortalidad por accidentes de tránsito. En cambio climático mide únicamente el área deforestada. No hay ningún indicador de transporte de carga.',
  },
  {
    title: 'Un dato abierto que el territorio no puede usar',
    description:
      'El Registro Nacional de Despacho de Carga (RNDC) se publica como archivos mensuales agregados, con nombres de municipio que requieren depuración. Un municipio no puede obtener de ahí una línea base propia sin procesar millones de registros.',
  },
  {
    title: 'Una IA que no puede inventar cifras',
    description:
      'Preguntarle a un modelo de lenguaje por una cifra de política pública es riesgoso. Aquí cada número de la respuesta se verifica contra los datos y, si no se puede respaldar, el asistente se abstiene.',
  },
];

const modules = [
  {
    to: '/app/estadisticas',
    title: 'Estadísticas',
    description: 'Viajes, toneladas y calidad del dato 2022–2026. Distingue registros de viajes.',
    destacado: false,
  },
  {
    to: '/app/emisiones',
    title: 'Emisiones del transporte de carga',
    description:
      'Toneladas-km y CO₂ estimado por municipio, departamento y corredor, con rango de incertidumbre.',
    destacado: true,
  },
  {
    to: '/app/geografia',
    title: 'Geografía',
    description: 'Mapa por departamento de producción y demanda de carga.',
    destacado: false,
  },
  {
    to: '/app/manifiestos',
    title: 'Manifiestos y corredores',
    description: 'Rutas origen–destino, mercancías y comparación interanual.',
    destacado: false,
  },
  {
    to: '/login',
    title: 'Portal privado y asistente',
    description:
      'Cada empresa carga su GPS o sus archivos RNDC y consulta a un asistente que verifica sus cifras.',
    destacado: false,
  },
];

const alignment = [
  [
    'Hábitat · movilidad inteligente',
    'Flujos origen–destino, viajes y toneladas-km por corredor',
    'Emisiones · Manifiestos',
  ],
  [
    'Medio ambiente · cambio climático',
    'CO₂ estimado del transporte de carga con rango (propuesta de indicador)',
    'Emisiones',
  ],
  [
    'Desarrollo económico · entorno productivo',
    'Distancia media, toneladas por viaje, concentración de flujos',
    'Estadísticas · Emisiones',
  ],
  [
    'Gobernanza · gobierno abierto',
    'Uso de datos abiertos con cada cifra trazable',
    'Todas las vistas',
  ],
  [
    'Eje habilitador · analítica y gestión de datos',
    'Tablas resumen, informe de calidad y API',
    'Estadísticas',
  ],
];

export function HomePage(): JSX.Element {
  const [overview, setOverview] = useState<EmissionsOverviewApi | null>(null);

  useEffect(() => {
    let active = true;
    getEmissionsOverview()
      .then((data) => {
        if (active) {
          setOverview(data);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const liveStats = overview
    ? [
        [
          `CO₂ estimado ${overview.anio}`,
          `${formatDecimal(overview.co2_t.central / 1e6, 2)} Mt`,
          `rango ${formatDecimal(overview.co2_t.bajo / 1e6, 1)}–${formatDecimal(overview.co2_t.alto / 1e6, 1)} Mt`,
        ],
        [
          'Trabajo de transporte',
          `${formatDecimal(overview.ton_km_pesados / 1e9, 1)} mil M t-km`,
          'vehículos pesados, tramo cargado',
        ],
        [
          'Distancia media',
          `${formatDecimal(overview.distancia_media_km, 0)} km`,
          'ponderada por toneladas',
        ],
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#101828]">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-5 lg:px-10 lg:pt-10">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e5e7eb] bg-white px-5 py-4 shadow-card">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.025em] text-[#4a5565]">
              TransData RNDC
            </p>
            <h1 className="mt-1 text-xl font-medium tracking-tight">
              Observatorio del transporte de carga
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-[#d4d4d4] bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.025em] text-[#364153] hover:bg-[#f5f5f5]"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/app/emisiones"
              className="rounded-lg bg-[#e42b0c] px-5 py-3 text-xs font-semibold uppercase tracking-[0.025em] text-white shadow-card hover:opacity-90"
            >
              Ver emisiones
            </Link>
          </div>
        </header>

        <section className="rounded-lg border border-[#e5e7eb] bg-white p-8 shadow-card md:p-12">
          <p className="text-xs font-medium uppercase tracking-[0.025em] text-[#4a5565]">
            Ciudades y territorios inteligentes · Colombia
          </p>
          <h2 className="mt-3 max-w-4xl text-4xl font-light leading-[1.1] tracking-[-0.03em] md:text-5xl">
            El transporte de carga que llega a las ciudades, medido con datos abiertos y respondido
            sin inventar cifras.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#4a5565]">
            TransData convierte el RNDC en indicadores por municipio y departamento, estima el CO₂
            del transporte de carga por carretera y ofrece un asistente de IA que solo responde lo
            que puede verificar. Está alineado con el modelo colombiano de madurez de ciudades y
            territorios inteligentes del MinTIC.
          </p>
          {liveStats.length ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {liveStats.map(([label, value, detail]) => (
                <div key={label} className="rounded-lg border border-[#e5e7eb] bg-[#f5f5f5] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.025em] text-[#4a5565]">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-light tracking-[-0.03em]">{value}</p>
                  <p className="mt-1 text-xs text-[#4a5565]">{detail}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <h3 className="mb-4 mt-12 text-2xl font-normal tracking-tight">El problema que resuelve</h3>
        <section className="grid gap-4 md:grid-cols-3">
          {problems.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-card"
            >
              <h4 className="text-lg font-medium tracking-tight">{item.title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-[#4a5565]">{item.description}</p>
            </article>
          ))}
        </section>

        <h3 className="mb-4 mt-12 text-2xl font-normal tracking-tight">Qué encuentra aquí</h3>
        <section className="grid gap-4 md:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className={`rounded-lg border p-6 shadow-card transition-shadow hover:shadow-lift ${
                m.destacado
                  ? 'border-[#1f1f1f] bg-[#1f1f1f] text-white'
                  : 'border-[#e5e7eb] bg-white'
              }`}
            >
              <h4 className="text-lg font-medium tracking-tight">{m.title}</h4>
              <p
                className={`mt-3 text-sm leading-relaxed ${m.destacado ? 'text-[#b8bfcc]' : 'text-[#4a5565]'}`}
              >
                {m.description}
              </p>
            </Link>
          ))}
        </section>

        <h3 className="mb-4 mt-12 text-2xl font-normal tracking-tight">
          Alineación con el modelo colombiano
        </h3>
        <section className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="px-5 py-3">Dimensión · subdimensión (MinTIC)</th>
                <th className="px-5 py-3">Qué aporta TransData</th>
                <th className="px-5 py-3">Dónde verlo</th>
              </tr>
            </thead>
            <tbody>
              {alignment.map(([dim, aporte, donde]) => (
                <tr key={dim} className="border-b border-[#e5e7eb] last:border-0">
                  <td className="px-5 py-3 font-medium">{dim}</td>
                  <td className="px-5 py-3 text-[#4a5565]">{aporte}</td>
                  <td className="px-5 py-3 text-[#4a5565]">{donde}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-8 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-card">
          <h4 className="text-lg font-medium tracking-tight">Qué no es</h4>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#4a5565]">
            <li>
              No es un inventario de emisiones: es una estimación del tramo cargado, con un rango de
              incertidumbre.
            </li>
            <li>
              No es un indicador oficial del MinTIC: es una propuesta para discutir con base en
              datos abiertos.
            </li>
            <li>
              El RNDC público es agregado y anónimo: no permite análisis por empresa ni trayectoria
              dentro de la ciudad.
            </li>
            <li>No mide percepción ciudadana ni la dimensión Personas del modelo.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
