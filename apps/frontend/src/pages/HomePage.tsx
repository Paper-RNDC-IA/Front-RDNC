import { Link } from 'react-router-dom';

const highlights = [
  {
    title: 'Datos publicos RNDC',
    description:
      'Indicadores, manifiestos y empresas con informacion oficial para lectura sectorial y evaluacion academica.',
  },
  {
    title: 'Inteligencia territorial',
    description:
      'Mapas por departamento para analizar produccion, demanda y regalias con enfoque geografico.',
  },
  {
    title: 'Zona privada empresarial',
    description:
      'Carga Excel GPS, genera KPIs internos y descarga informes sin exponer datos sensibles.',
  },
];

export function HomePage(): JSX.Element {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffdfb] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(249,115,22,0.18),transparent_36%),radial-gradient(circle_at_95%_8%,rgba(251,146,60,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(234,88,12,0.08),transparent_45%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-5 sm:pb-12 sm:pt-8 lg:px-10 lg:pt-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-zinc-200 bg-white px-4 py-3 shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:mb-10 sm:gap-4 sm:px-5 sm:py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-orange-600">TransData RNDC</p>
            <h1 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
              Monitoreo integral de transporte de carga
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-zinc-100"
            >
              Registrarse
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-zinc-100"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/app/estadisticas"
              className="rounded-md border border-orange-500 bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
            >
              Entrar al panel
            </Link>
          </div>
        </header>

        <section className="grid gap-5 sm:gap-6 lg:grid-cols-[1.25fr_1fr]">
          <article className="rounded-3xl border-2 border-zinc-200 bg-white p-5 shadow-[0_18px_36px_rgba(15,23,42,0.08)] sm:p-7">
            <div className="inline-flex rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
              Plataforma nacional de analitica RNDC
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              Plataforma explicativa para datos publicos RNDC y analitica privada empresarial.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
              Este inicio esta pensado para que un evaluador entienda rapidamente que modulo
              consultar, que tipo de dato utiliza cada vista y cual es su objetivo analitico. Cada
              bloque de navegacion distingue claramente entre datos publicos, privados y analisis
              territorial.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-zinc-200 bg-[#fffaf6] p-4"
                >
                  <h3 className="text-sm font-semibold text-orange-700">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="rounded-3xl border-2 border-zinc-200 bg-white p-5 shadow-[0_18px_36px_rgba(15,23,42,0.08)] sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">Ruta recomendada</h3>
            <p className="mt-2 text-sm text-slate-600">
              Sigue este orden para interpretar la plataforma sin contexto previo.
            </p>

            <ol className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="rounded-xl border border-zinc-200 bg-[#fffaf6] px-3 py-2.5">
                1. Revisar estado general en Estadisticas.
              </li>
              <li className="rounded-xl border border-zinc-200 bg-[#fffaf6] px-3 py-2.5">
                2. Profundizar en RNDC publico: Manifiestos y Empresas.
              </li>
              <li className="rounded-xl border border-zinc-200 bg-[#fffaf6] px-3 py-2.5">
                3. Revisar Inteligencia territorial en Geografia.
              </li>
              <li className="rounded-xl border border-zinc-200 bg-[#fffaf6] px-3 py-2.5">
                4. Iniciar sesion para acceder a telemetria y portal privado.
              </li>
            </ol>
          </aside>
        </section>
      </div>
    </div>
  );
}
