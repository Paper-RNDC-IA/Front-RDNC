import { FormEvent } from 'react';

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
}: ChatInputProps): JSX.Element {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSend();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-zinc-200 bg-[#fffaf6] px-2.5 py-2"
    >
      <div className="flex items-end gap-2 rounded-xl border border-zinc-300 bg-white px-2 py-1.5 shadow-inner shadow-zinc-200/80">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Escribe una consulta sobre manifiestos, telemetria o geografia..."
          rows={2}
          disabled={disabled}
          className="max-h-20 min-h-9 flex-1 resize-none overflow-y-hidden bg-transparent px-2 py-1 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
        />

        <button
          type="submit"
          disabled={disabled || value.trim().length === 0}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-orange-400 bg-orange-500 text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:border-zinc-300 disabled:bg-zinc-300 disabled:text-slate-500"
          aria-label="Enviar mensaje"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M3 10L16 4L11.5 10L16 16L3 10Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
