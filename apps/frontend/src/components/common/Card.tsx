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
        'relative overflow-hidden rounded-[20px] border border-[#d2daeb] bg-white p-5 shadow-[0_10px_24px_rgba(20,49,94,0.08)]',
        className ?? '',
      ].join(' ')}
    >
      {(title || actions) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h3 className="text-2xl font-semibold tracking-tight text-[#193a67]">{title}</h3>
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
