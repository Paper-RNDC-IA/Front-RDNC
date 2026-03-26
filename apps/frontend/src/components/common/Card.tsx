import { type PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<{
  title?: string;
  actions?: JSX.Element;
  className?: string;
}>;

export function Card({ title, actions, className, children }: CardProps): JSX.Element {
  return (
    <section
      className={['rounded-2xl border border-slate-700 bg-slate-800/65 p-4', className ?? ''].join(
        ' ',
      )}
    >
      {(title || actions) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title ? <h3 className="text-sm font-semibold text-slate-100">{title}</h3> : <span />}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
