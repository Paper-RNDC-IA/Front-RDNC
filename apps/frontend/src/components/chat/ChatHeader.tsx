import { AgentStatusBadge } from './AgentStatusBadge';

type ChatHeaderProps = {
  status: 'online' | 'thinking' | 'offline';
  onClose: () => void;
};

export function ChatHeader({ status, onClose }: ChatHeaderProps): JSX.Element {
  return (
    <header className="flex items-start justify-between gap-3 border-b border-zinc-200 bg-[#fff7f2] px-3 py-2.5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-orange-600">Asistente RNDC</p>
        <h2 className="mt-1 text-sm font-semibold text-slate-900">Centro de ayuda operacional</h2>
        <div className="mt-1.5">
          <AgentStatusBadge status={status} />
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-md border border-zinc-300 bg-white p-1.5 text-slate-700 transition hover:bg-zinc-100"
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
