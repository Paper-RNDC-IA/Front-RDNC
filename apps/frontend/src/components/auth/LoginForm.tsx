import type { LoginRequest } from '../../types/auth';

type LoginFormProps = {
  values: LoginRequest;
  loading: boolean;
  error: string | null;
  onChange: (next: LoginRequest) => void;
  onSubmit: () => Promise<void>;
};

export function LoginForm({
  values,
  loading,
  error,
  onChange,
  onSubmit,
}: LoginFormProps): JSX.Element {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <label className="block space-y-1 text-sm text-slate-300">
        <span>NIT de empresa</span>
        <input
          type="text"
          value={values.companyNit}
          onChange={(event) => onChange({ ...values, companyNit: event.target.value })}
          placeholder="901234567-1"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
        />
      </label>

      <label className="block space-y-1 text-sm text-slate-300">
        <span>Correo corporativo</span>
        <input
          type="email"
          value={values.email}
          onChange={(event) => onChange({ ...values, email: event.target.value })}
          placeholder="admin@empresa.com"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
        />
      </label>

      <label className="block space-y-1 text-sm text-slate-300">
        <span>Contrasena</span>
        <input
          type="password"
          value={values.password}
          onChange={(event) => onChange({ ...values, password: event.target.value })}
          placeholder="********"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
        />
      </label>

      {error ? (
        <div className="rounded-md border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-orange-700 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Validando acceso...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
