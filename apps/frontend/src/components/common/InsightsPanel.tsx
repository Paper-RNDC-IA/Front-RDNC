import type { InsightItem } from '../../types/common';
import { Card } from './Card';

type InsightsPanelProps = {
  title: string;
  items: InsightItem[];
};

function resolveToneStyles(tone: InsightItem['tone']): string {
  if (tone === 'positive') {
    return 'border-orange-200 bg-orange-50 text-slate-800';
  }

  if (tone === 'warning') {
    return 'border-zinc-300 bg-zinc-100 text-slate-800';
  }

  return 'border-zinc-200 bg-white text-slate-800';
}

export function InsightsPanel({ title, items }: InsightsPanelProps): JSX.Element {
  if (!items.length) {
    return (
      <Card title={title}>
        <p className="text-sm text-slate-600">No hay hallazgos suficientes para este periodo.</p>
      </Card>
    );
  }

  return (
    <Card title={title}>
      <ul className="space-y-2">
        {items.slice(0, 3).map((item) => (
          <li
            key={item.title}
            className={`rounded-xl border px-3 py-3 shadow-sm ${resolveToneStyles(item.tone)}`}
          >
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-1.5 text-xs opacity-95">{item.detail}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
