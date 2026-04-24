import { NavLink } from 'react-router-dom';

type SidebarProps = {
  open: boolean;
  onNavigate: () => void;
};

type EnabledNavItem = {
  to: string;
  label: string;
};

type NavGroup = {
  title: string;
  items: EnabledNavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: 'General',
    items: [{ to: '/', label: 'Inicio' }],
  },
  {
    title: 'RNDC Publico',
    items: [
      { to: '/app/estadisticas', label: 'Estadisticas' },
      { to: '/app/manifiestos', label: 'Manifiestos' },
      { to: '/app/telemetria', label: 'Telemetria' },
      { to: '/app/empresas', label: 'Empresas' },
    ],
  },
  {
    title: 'Territorial',
    items: [{ to: '/app/geografia', label: 'Geografia' }],
  },
  {
    title: 'Empresa',
    items: [
      { to: '/app/portal-empresa', label: 'Portal Empresa' },
      { to: '/app/descarga-informe', label: 'Informes' },
    ],
  },
];

export function Sidebar({ open, onNavigate }: SidebarProps): JSX.Element {
  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto overscroll-contain border-r-2 border-zinc-200 bg-[#fffdfa] px-5 py-7 shadow-[10px_0_28px_rgba(15,23,42,0.06)] transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 md:w-64',
        open ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      <div className="mb-7 rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50 to-white px-4 py-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-orange-600">Plataforma</p>
        <h1 className="mt-1 text-base font-semibold text-slate-900">TransData RNDC</h1>
        <p className="mt-1 text-xs text-slate-600">Monitoreo de carga terrestre</p>
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto pr-1">
        {navGroups.map((group) => (
          <section key={group.title} className="pb-2 last:pb-0">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{group.title}</p>
            <div className="mt-2 space-y-1.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    [
                      'block rounded-xl px-3 py-2.5 transition-all duration-150',
                      isActive
                        ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-slate-900 shadow-[0_8px_18px_rgba(249,115,22,0.14)]'
                        : 'text-slate-700 hover:bg-white/80 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  <p className="text-[15px] font-semibold">{item.label}</p>
                </NavLink>
              ))}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}
