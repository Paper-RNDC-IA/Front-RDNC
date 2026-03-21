import { Link } from 'react-router-dom';

import { RegisterForm } from '../components/auth/RegisterForm';
import { useRegisterPage } from '../hooks/useRegisterPage';

export function RegisterPage(): JSX.Element {
  const { values, loading, error, setValues, onSubmit } = useRegisterPage();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.22),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(251,146,60,0.16),transparent_45%)]" />

      <section className="relative z-10 grid w-full max-w-5xl gap-6 rounded-3xl border border-slate-800 bg-slate-900/85 p-6 shadow-2xl backdrop-blur lg:grid-cols-[1.2fr_1fr] lg:p-10">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-orange-800/40 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
            Registro empresarial
          </div>
          <h1 className="text-3xl font-semibold text-slate-100">Crea tu cuenta de empresa</h1>
          <p className="max-w-xl text-sm text-slate-300">
            Registra tu empresa para ingresar al espacio privado donde podras cargar archivos internos,
            analizarlos y generar reportes y estadisticas de seguimiento.
          </p>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
            <p className="font-medium text-slate-100">Requisitos minimos</p>
            <p className="mt-2">1. NIT valido</p>
            <p>2. Correo corporativo</p>
            <p>3. Contrasena de acceso</p>
          </div>

          <div className="space-x-4 text-sm">
            <Link to="/" className="text-orange-300 hover:text-orange-200">
              Volver al inicio
            </Link>
            <Link to="/login" className="text-orange-300 hover:text-orange-200">
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Registrarse</h2>
          <RegisterForm
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
