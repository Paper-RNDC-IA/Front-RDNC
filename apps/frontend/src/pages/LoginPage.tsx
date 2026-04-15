import { Link } from 'react-router-dom';

import { LoginForm } from '../components/auth/LoginForm';
import { useLoginPage } from '../hooks/useLoginPage';

export function LoginPage(): JSX.Element {
  const { values, loading, error, setValues, onSubmit } = useLoginPage();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffdfa] p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.15),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(251,146,60,0.1),transparent_45%)]" />

      <section className="relative z-10 grid w-full max-w-5xl gap-6 rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.1)] backdrop-blur lg:grid-cols-[1.2fr_1fr] lg:p-10">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
            Acceso empresarial seguro
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">Portal privado para empresas</h1>
          <p className="max-w-xl text-sm text-slate-600">
            Inicia sesion para cargar archivos internos, administrarlos y consultar analitica
            derivada para seguimiento operativo y toma de decisiones.
          </p>

          <div className="rounded-2xl border border-zinc-200 bg-[#fffaf6] p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Credenciales demo</p>
            <p className="mt-2">NIT: 901234567-1</p>
            <p>Correo: admin@cargaandina.com</p>
            <p>Contrasena: TransData123*</p>
          </div>

          <Link to="/" className="inline-block text-sm font-medium text-orange-700 hover:text-orange-800">
            Volver al inicio
          </Link>
          <Link
            to="/register"
            className="ml-4 inline-block text-sm font-medium text-orange-700 hover:text-orange-800"
          >
            Registrarse
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Iniciar sesión</h2>
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
