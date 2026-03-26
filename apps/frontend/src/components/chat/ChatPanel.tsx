import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';
import { type ChatMessage } from './ChatMessageItem';

type ChatPanelProps = {
  open: boolean;
  messages: ChatMessage[];
  draft: string;
  isTyping: boolean;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
};

export function ChatPanel({
  open,
  messages,
  draft,
  isTyping,
  onDraftChange,
  onSend,
  onClose,
}: ChatPanelProps): JSX.Element {
  return (
    <section
      className={[
        'relative w-[min(90vw,330px)] overflow-hidden rounded-2xl border border-slate-300/85 bg-slate-100/95 shadow-[0_16px_34px_rgba(15,23,42,0.25)] backdrop-blur transition-all duration-300',
        open
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-5 opacity-0',
      ].join(' ')}
      aria-hidden={!open}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.65),transparent_45%)]" />

      <ChatHeader status={isTyping ? 'thinking' : 'online'} onClose={onClose} />

      <div className="relative grid h-[420px] grid-rows-[1fr_auto] px-2.5 pb-2 pt-2">
        <div className="overflow-hidden rounded-xl border border-slate-300 bg-white/92 p-2.5 shadow-inner shadow-slate-500/10">
          <ChatMessageList messages={messages} isTyping={isTyping} />
        </div>

        <div className="mt-2 -mx-2.5 -mb-2">
          <ChatInput value={draft} onChange={onDraftChange} onSend={onSend} disabled={isTyping} />
        </div>
      </div>
    </section>
  );
}
