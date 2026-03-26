import { AgentStatusBadge } from './AgentStatusBadge';

type ChatHeaderProps = {
  status: 'online' | 'thinking' | 'offline';
  onClose: () => void;
};

export function ChatHeader({ status, onClose }: ChatHeaderProps): JSX.Element {
  return (
    <header className="flex items-start justify-between gap-3 border-b border-slate-500/70 bg-gradient-to-r from-slate-600 to-slate-500 px-3 py-2.5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-100/90">Asistente RNDC</p>
        <h2 className="mt-1 text-sm font-semibold text-white">Centro de ayuda operacional</h2>
        <div className="mt-1.5">
          <AgentStatusBadge status={status} />
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-md border border-slate-200/35 bg-slate-500/45 p-1.5 text-slate-50 transition hover:border-slate-100/55 hover:bg-slate-400/55"
        aria-label="Cerrar chat"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
          <path
            d="M5 5L15 15M15 5L5 15"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </header>
  );
}
