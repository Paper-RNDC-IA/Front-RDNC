import type { RegisterCompanyRequest } from '../../types/auth';

type RegisterFormProps = {
  values: RegisterCompanyRequest;
  loading: boolean;
  error: string | null;
  onChange: (next: RegisterCompanyRequest) => void;
  onSubmit: () => Promise<void>;
};

export function RegisterForm({
  values,
  loading,
  error,
  onChange,
  onSubmit,
}: RegisterFormProps): JSX.Element {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <label className="block space-y-1 text-sm text-slate-700">
        <span>Nombre de empresa</span>
        <input
          type="text"
          value={values.companyName}
          onChange={(event) => onChange({ ...values, companyName: event.target.value })}
          placeholder="Transportes Ejemplo SAS"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-slate-900"
        />
      </label>

      <label className="block space-y-1 text-sm text-slate-700">
        <span>NIT de empresa</span>
        <input
          type="text"
          value={values.companyNit}
          onChange={(event) => onChange({ ...values, companyNit: event.target.value })}
          placeholder="901234567-1"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-slate-900"
        />
      </label>

      <label className="block space-y-1 text-sm text-slate-700">
        <span>Correo corporativo</span>
        <input
          type="email"
          value={values.email}
          onChange={(event) => onChange({ ...values, email: event.target.value })}
          placeholder="contacto@empresa.com"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-slate-900"
        />
      </label>

      <label className="block space-y-1 text-sm text-slate-700">
        <span>Contrasena</span>
        <input
          type="password"
          value={values.password}
          onChange={(event) => onChange({ ...values, password: event.target.value })}
          placeholder="********"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-slate-900"
        />
      </label>

      <label className="block space-y-1 text-sm text-slate-700">
        <span>Confirmar contrasena</span>
        <input
          type="password"
          value={values.confirmPassword}
          onChange={(event) => onChange({ ...values, confirmPassword: event.target.value })}
          placeholder="********"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-slate-900"
        />
      </label>

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
        {loading ? 'Registrando empresa...' : 'Registrarse'}
      </button>
    </form>
  );
}
