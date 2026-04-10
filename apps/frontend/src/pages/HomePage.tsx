import { Link } from 'react-router-dom';

const highlights = [
  {
    title: 'Panorama nacional RNDC',
    description:
      'Visualiza indicadores estrategicos de transporte terrestre en Colombia y detecta tendencias operativas desde un solo tablero.',
  },
  {
    title: 'Monitoreo y geografia',
    description:
      'Analiza manifiestos, telemetria y comportamiento territorial por departamento para mejorar trazabilidad y seguimiento.',
  },
  {
    title: 'Espacio privado empresarial',
    description:
      'Autentica tu empresa para cargar archivos, gestionarlos y convertirlos en reportes y estadisticas para decisiones internas.',
  },
];

const moduleGuide = [
  {
    name: 'Analitica estrategica',
    routes: 'Estadisticas y Manifiestos',
    action: '/app/estadisticas',
    actionLabel: 'Ir al panel estrategico',
  },
  {
    name: 'Control operativo',
    routes: 'Telemetria y Geografia',
    action: '/app/telemetria',
    actionLabel: 'Ir al control operativo',
  },
  {
    name: 'Entorno empresarial',
    routes: 'Portal privado, archivos y reportes',
    action: '/register',
    actionLabel: 'Registrarse e iniciar',
  },
];

export function HomePage(): JSX.Element {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(249,115,22,0.28),transparent_36%),radial-gradient(circle_at_95%_8%,rgba(251,146,60,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(234,88,12,0.12),transparent_45%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-8 lg:px-10 lg:pt-10">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-orange-900/45 bg-slate-900/75 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-orange-300">TransData RNDC</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-100">
              Monitoreo integral de transporte de carga
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="rounded-md border border-orange-700 bg-orange-900/20 px-4 py-2 text-sm font-medium text-orange-200 hover:bg-orange-800/30"
            >
              Registrarse
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-orange-700 bg-orange-900/20 px-4 py-2 text-sm font-medium text-orange-200 hover:bg-orange-800/30"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/app/estadisticas"
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500"
            >
              Entrar al panel
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <article className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            <div className="inline-flex rounded-full border border-orange-900/50 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
              Plataforma nacional de analitica RNDC
            </div>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-slate-50">
              Un inicio claro, una navegacion progresiva y un entorno empresarial seguro.
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-300">
              Esta pagina principal resume lo esencial y organiza el acceso al resto de
              funcionalidades. Desde aqui puedes ingresar al panel operacional general o
              autenticarte para entrar al espacio privado de tu empresa.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <h3 className="text-sm font-semibold text-orange-200">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-100">Ruta recomendada</h3>
            <p className="mt-2 text-sm text-slate-400">
              Empieza por la vista general y luego entra al modulo que necesites segun tu rol
              operativo o empresarial.
            </p>

            <ol className="mt-5 space-y-3 text-sm text-slate-300">
              <li className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
                1. Revisar estado general en Estadisticas.
              </li>
              <li className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
                2. Profundizar por modulo (Manifiestos, Telemetria, Geografia).
              </li>
              <li className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
                3. Iniciar sesión para gestionar archivos internos de empresa.
              </li>
            </ol>
          </aside>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Acceso por bloques funcionales
              </h3>
              <p className="text-sm text-slate-400">
                En lugar de exponer todo desde el inicio, los modulos se agrupan para una entrada
                ordenada.
              </p>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {moduleGuide.map((module) => (
              <article
                key={module.name}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <h4 className="text-sm font-semibold text-orange-200">{module.name}</h4>
                <p className="mt-1 text-xs text-slate-400">{module.routes}</p>
                <Link
                  to={module.action}
                  className="mt-4 inline-block rounded-md bg-orange-700 px-3 py-2 text-xs font-medium text-white hover:bg-orange-600"
                >
                  {module.actionLabel}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
