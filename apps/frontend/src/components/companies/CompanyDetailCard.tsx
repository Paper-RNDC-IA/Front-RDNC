import type { CompanyRow } from '../../adapters/companies.adapter';
import { Card } from '../common/Card';

type CompanyDetailCardProps = {
  company: CompanyRow | null;
};

export function CompanyDetailCard({ company }: CompanyDetailCardProps): JSX.Element {
  if (!company) {
    return (
      <Card title="Detalle de empresa">
        <p className="text-sm text-slate-400">Selecciona una empresa para ver su detalle.</p>
      </Card>
    );
  }

  return (
    <Card title="Detalle de empresa">
      <dl className="space-y-3 text-sm">
        <div className="rounded-lg bg-slate-950/70 px-3 py-2">
          <dt className="text-slate-400">Nombre</dt>
          <dd className="text-slate-100">{company.name}</dd>
        </div>
        <div className="rounded-lg bg-slate-950/70 px-3 py-2">
          <dt className="text-slate-400">NIT</dt>
          <dd className="text-slate-100">{company.nit}</dd>
        </div>
        <div className="rounded-lg bg-slate-950/70 px-3 py-2">
          <dt className="text-slate-400">Vehiculos activos</dt>
          <dd className="text-slate-100">{company.activeVehicles}</dd>
        </div>
        <div className="rounded-lg bg-slate-950/70 px-3 py-2">
          <dt className="text-slate-400">Cumplimiento</dt>
          <dd className="text-slate-100">{company.compliance}</dd>
        </div>
        <div className="rounded-lg bg-slate-950/70 px-3 py-2">
          <dt className="text-slate-400">Ciudad</dt>
          <dd className="text-slate-100">{company.city}</dd>
        </div>
        <div className="rounded-lg bg-slate-950/70 px-3 py-2">
          <dt className="text-slate-400">Estado</dt>
          <dd className="text-slate-100">{company.status}</dd>
        </div>
      </dl>
    </Card>
  );
}
