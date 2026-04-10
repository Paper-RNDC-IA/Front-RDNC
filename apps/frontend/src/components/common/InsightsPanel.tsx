import type { InsightItem } from '../../types/common';
import { Card } from './Card';

type InsightsPanelProps = {
  title: string;
  items: InsightItem[];
};

function resolveToneStyles(tone: InsightItem['tone']): string {
  if (tone === 'positive') {
    return 'border-emerald-900/70 bg-emerald-950/30 text-emerald-100';
  }

  if (tone === 'warning') {
    return 'border-amber-900/70 bg-amber-950/30 text-amber-100';
  }

  return 'border-slate-700 bg-slate-900/65 text-slate-200';
}

export function InsightsPanel({ title, items }: InsightsPanelProps): JSX.Element {
  if (!items.length) {
    return (
      <Card title={title}>
        <p className="text-sm text-slate-400">No hay hallazgos suficientes para este periodo.</p>
      </Card>
    );
  }

  return (
    <Card title={title}>
      <ul className="space-y-2">
        {items.slice(0, 3).map((item) => (
          <li
            key={item.title}
            className={`rounded-xl border px-3 py-2 ${resolveToneStyles(item.tone)}`}
          >
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-1 text-xs opacity-90">{item.detail}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
