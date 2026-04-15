import { type PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<{
  title?: string;
  actions?: JSX.Element;
  className?: string;
}>;

export function Card({ title, actions, className, children }: CardProps): JSX.Element {
  return (
    <section
      className={[
        'relative overflow-hidden rounded-2xl border-2 border-zinc-300 bg-white p-5 shadow-[0_14px_28px_rgba(15,23,42,0.08)]',
        className ?? '',
      ].join(' ')}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300" />
      {(title || actions) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h3 className="text-xl font-semibold tracking-wide text-slate-900">{title}</h3>
          ) : (
            <span />
          )}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
