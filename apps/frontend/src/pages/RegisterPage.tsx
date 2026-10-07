import { Link } from 'react-router-dom';

import { RegisterForm } from '../components/auth/RegisterForm';
import { useRegisterPage } from '../hooks/useRegisterPage';

export function RegisterPage(): JSX.Element {
  const { values, loading, error, setValues, onSubmit } = useRegisterPage();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#ffffff] p-4">
      <section className="relative z-10 grid w-full max-w-5xl gap-4 rounded-3xl border-2 border-zinc-200 bg-white p-4 shadow-[0_20px_40px_rgba(15,23,42,0.1)] backdrop-blur sm:gap-6 sm:p-6 lg:grid-cols-[1.2fr_1fr] lg:p-10">
        <div className="space-y-4">
          <div className="inline-flex rounded-lg border border-[#d4d4d4] bg-white px-3 py-1 text-xs font-medium text-orange-700">
            Registro empresarial
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Crea tu cuenta de empresa
          </h1>
          <p className="max-w-xl text-sm text-slate-600">
            Registra tu empresa para ingresar al espacio privado donde podras cargar archivos
            internos, analizarlos y generar reportes y estadisticas de seguimiento.
          </p>

          <div className="rounded-2xl border border-zinc-200 bg-[#ffffff] p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Requisitos minimos</p>
            <p className="mt-2">1. NIT valido</p>
            <p>2. Correo corporativo</p>
            <p>3. Contrasena de acceso</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm sm:gap-4">
            <Link to="/" className="font-medium text-orange-700 hover:text-orange-800">
              Volver al inicio
            </Link>
            <Link to="/login" className="font-medium text-orange-700 hover:text-orange-800">
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Registrarse</h2>
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
