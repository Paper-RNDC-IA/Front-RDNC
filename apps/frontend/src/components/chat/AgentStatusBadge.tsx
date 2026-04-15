type AgentStatus = 'online' | 'thinking' | 'offline';

type AgentStatusBadgeProps = {
  status: AgentStatus;
};

const STATUS_STYLES: Record<AgentStatus, { label: string; classes: string }> = {
  online: {
    label: 'Agente activo',
    classes: 'border-orange-200 bg-white text-slate-700',
  },
  thinking: {
    label: 'Analizando consulta',
    classes: 'border-orange-300 bg-orange-50 text-orange-700',
  },
  offline: {
    label: 'Agente no disponible',
    classes: 'border-zinc-300 bg-zinc-100 text-slate-600',
  },
};

export function AgentStatusBadge({ status }: AgentStatusBadgeProps): JSX.Element {
  const config = STATUS_STYLES[status];

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide shadow-sm',
        config.classes,
      ].join(' ')}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
