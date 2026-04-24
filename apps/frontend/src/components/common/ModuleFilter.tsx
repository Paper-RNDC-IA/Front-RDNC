import type { ExportModule } from '../../types/export';
import { Card } from './Card';

type ModuleFilterProps = {
  value: string;
  onChange: (value: ExportModule) => void;
};

const modules: Array<{ label: string; value: ExportModule }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Estadisticas', value: 'stats' },
  { label: 'Manifiestos', value: 'manifests' },
  { label: 'Telemetria', value: 'telemetry' },
  { label: 'Rutas', value: 'routes' },
  { label: 'Empresas', value: 'companies' },
];

export function ModuleFilter({ value, onChange }: ModuleFilterProps): JSX.Element {
  return (
    <Card title="Filtro por modulo" className="border-[#d2daeb] bg-[#f7f9fe]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as ExportModule)}
        className="w-full rounded-lg border border-[#cbd7eb] bg-white px-3 py-2 text-[#1d3d68]"
      >
        {modules.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </Card>
  );
}
