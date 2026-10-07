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
        'relative overflow-hidden rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-lift',
        className ?? '',
      ].join(' ')}
    >
      {(title || actions) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h3 className="text-xl font-medium tracking-tight text-[#101828]">{title}</h3>
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
