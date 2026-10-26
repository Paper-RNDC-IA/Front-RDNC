import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type MetricInfoTooltipProps = {
  label?: string;
  meaning: string;
  interpretation?: string;
  source?: string;
  calculation?: string;
  className?: string;
};

const WIDTH = 288;
const MARGIN = 12;

type Position = { top: number; left: number; maxHeight: number };

export function MetricInfoTooltip({
  label = 'Info',
  meaning,
  interpretation,
  calculation,
  className,
}: MetricInfoTooltipProps): JSX.Element {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<Position | null>(null);

  // El recuadro se dibuja en el body con posicion fija: dentro de la tarjeta lo recortaba su
  // overflow-hidden y lo tapaban las tarjetas vecinas, asi que no se alcanzaba a leer.
  const open = (): void => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    const width = Math.min(WIDTH, window.innerWidth - MARGIN * 2);
    const left = Math.min(Math.max(rect.right - width, MARGIN), window.innerWidth - width - MARGIN);
    const below = window.innerHeight - rect.bottom - MARGIN * 2;
    const above = rect.top - MARGIN * 2;
    const placeBelow = below >= 160 || below >= above;
    setPosition({
      left,
      top: placeBelow ? rect.bottom + 8 : Math.max(MARGIN, rect.top - 8 - Math.min(above, 260)),
      maxHeight: Math.max(120, placeBelow ? below : Math.min(above, 260)),
    });
  };

  const close = (): void => setPosition(null);

  return (
    <div className={['relative inline-flex', className ?? ''].join(' ')}>
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 bg-white text-[11px] font-semibold text-slate-700 transition-colors hover:border-orange-300 hover:text-orange-700"
        aria-label={label}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        onClick={() => (position ? close() : open())}
      >
        i
      </button>
      {position
        ? createPortal(
            <div
              role="tooltip"
              style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                width: Math.min(WIDTH, window.innerWidth - MARGIN * 2),
                maxHeight: position.maxHeight,
              }}
              className="pointer-events-none z-[1000] overflow-y-auto rounded-lg border border-[#e5e7eb] bg-white p-3 text-xs text-slate-700 shadow-lift"
            >
              <p className="font-semibold text-[#101828]">{label}</p>
              <p className="mt-1 leading-relaxed text-slate-700">{meaning}</p>
              {interpretation ? (
                <p className="mt-2 text-slate-600">
                  <span className="font-semibold text-slate-800">Interpretacion:</span>{' '}
                  {interpretation}
                </p>
              ) : null}
              {calculation ? (
                <p className="mt-1 text-slate-600">
                  <span className="font-semibold text-slate-800">Calculo:</span> {calculation}
                </p>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
