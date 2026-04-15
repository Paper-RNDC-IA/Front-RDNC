import { useState } from 'react';

type InfoDrawerProps = {
  triggerLabel?: string;
  title: string;
  purpose: string;
  source: string;
  interpretation: string;
  limitations: string;
  useCases: string[];
};

export function InfoDrawer({
  triggerLabel = 'Ver ayuda rapida',
  title,
  purpose,
  source,
  interpretation,
  limitations,
  useCases,
}: InfoDrawerProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-zinc-100"
      >
        {triggerLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/35 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Cerrar ayuda"
            className="h-full flex-1 cursor-default"
            onClick={() => setOpen(false)}
          />

          <aside className="h-full w-full max-w-md border-l border-zinc-200 bg-[#fffdfa] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-orange-500">
                  Guia del modulo
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-zinc-300 px-2 py-1 text-xs text-slate-700 hover:bg-zinc-100"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm text-slate-700">
              <section className="rounded-xl border border-zinc-200 bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Proposito</p>
                <p className="mt-1 leading-relaxed">{purpose}</p>
              </section>

              <section className="rounded-xl border border-zinc-200 bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Fuente de datos</p>
                <p className="mt-1 leading-relaxed">{source}</p>
              </section>

              <section className="rounded-xl border border-zinc-200 bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Como interpretar</p>
                <p className="mt-1 leading-relaxed">{interpretation}</p>
              </section>

              <section className="rounded-xl border border-zinc-200 bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Limitaciones</p>
                <p className="mt-1 leading-relaxed">{limitations}</p>
              </section>

              <section className="rounded-xl border border-zinc-200 bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Usos recomendados</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {useCases.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-zinc-200 bg-[#fffdfa] px-2 py-1"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
