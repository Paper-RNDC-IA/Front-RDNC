import { NavLink } from 'react-router-dom';

type SidebarProps = {
  open: boolean;
  onNavigate: () => void;
};

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/app/estadisticas', label: 'Estadisticas' },
  { to: '/app/manifiestos', label: 'Manifiestos' },
  { to: '/app/telemetria', label: 'Telemetria' },
  { to: '/app/geografia', label: 'Mapa Interactivo' },
  { to: '/app/empresas', label: 'Empresas' },
  { to: '/app/portal-empresa', label: 'Portal Empresa' },
  { to: '/app/descarga-informe', label: 'Descarga Informe' },
];

export function Sidebar({ open, onNavigate }: SidebarProps): JSX.Element {
  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-800 bg-slate-950/95 px-4 py-6 transition-transform duration-300 md:translate-x-0 md:static md:w-64',
        open ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      <div className="mb-8 rounded-xl border border-orange-900/40 bg-slate-900 p-4">
        <h1 className="text-lg font-semibold text-orange-300">TransData RNDC</h1>
        <p className="mt-1 text-sm text-slate-400">Monitoreo de carga terrestre</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'block rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-orange-500/20 text-orange-200'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
