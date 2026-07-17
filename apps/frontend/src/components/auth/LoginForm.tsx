import { useState } from 'react';
import type { LoginRequest } from '../../types/auth';

type LoginFormProps = {
  values: LoginRequest;
  loading: boolean;
  error: string | null;
  onChange: (next: LoginRequest) => void;
  onSubmit: () => Promise<void>;
};

function EyeIcon({ open }: { open: boolean }): JSX.Element {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

export function LoginForm({
  values,
  loading,
  error,
  onChange,
  onSubmit,
}: LoginFormProps): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <label className="block space-y-1 text-sm text-slate-700">
        <span>NIT de empresa</span>
        <input
          type="text"
          value={values.companyNit}
          onChange={(event) => onChange({ ...values, companyNit: event.target.value })}
          placeholder="901234567-1"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-300"
        />
      </label>

      <label className="block space-y-1 text-sm text-slate-700">
        <span>Correo corporativo</span>
        <input
          type="email"
          value={values.email}
          onChange={(event) => onChange({ ...values, email: event.target.value })}
          placeholder="admin@empresa.com"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-300"
        />
      </label>

      <div className="space-y-1">
        <label className="text-sm text-slate-700">Contraseña</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={(event) => onChange({ ...values, password: event.target.value })}
            placeholder="********"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 pr-10 text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-orange-300 bg-orange-50 px-3 py-2 text-sm text-slate-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md border border-orange-500 bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Validando acceso...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
