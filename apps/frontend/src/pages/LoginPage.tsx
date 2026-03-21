import { Link } from 'react-router-dom';

import { LoginForm } from '../components/auth/LoginForm';
import { useLoginPage } from '../hooks/useLoginPage';

export function LoginPage(): JSX.Element {
  const { values, loading, error, setValues, onSubmit } = useLoginPage();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.22),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(251,146,60,0.16),transparent_45%)]" />

      <section className="relative z-10 grid w-full max-w-5xl gap-6 rounded-3xl border border-slate-800 bg-slate-900/85 p-6 shadow-2xl backdrop-blur lg:grid-cols-[1.2fr_1fr] lg:p-10">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-orange-800/40 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
            Acceso empresarial seguro
          </div>
          <h1 className="text-3xl font-semibold text-slate-100">Portal privado para empresas</h1>
          <p className="max-w-xl text-sm text-slate-300">
            Inicia sesion para cargar archivos internos, administrarlos y consultar analitica derivada para
            seguimiento operativo y toma de decisiones.
          </p>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
            <p className="font-medium text-slate-100">Credenciales demo</p>
            <p className="mt-2">NIT: 901234567-1</p>
            <p>Correo: admin@cargaandina.com</p>
            <p>Contrasena: TransData123*</p>
          </div>

          <Link to="/" className="inline-block text-sm text-orange-300 hover:text-orange-200">
            Volver al inicio
          </Link>
          <Link to="/register" className="ml-4 inline-block text-sm text-orange-300 hover:text-orange-200">
            Registrarse
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Iniciar sesión</h2>
          <LoginForm
            values={values}
            loading={loading}
            error={error}
            onChange={setValues}
            onSubmit={onSubmit}
          />
        </div>
      </section>
    </div>
  );
}
