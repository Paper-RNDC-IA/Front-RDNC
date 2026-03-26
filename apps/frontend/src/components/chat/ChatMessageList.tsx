import { ChatMessageItem, type ChatMessage } from './ChatMessageItem';

type ChatMessageListProps = {
  messages: ChatMessage[];
  isTyping: boolean;
};

export function ChatMessageList({ messages, isTyping }: ChatMessageListProps): JSX.Element {
  return (
    <div className="chat-scroll flex h-full flex-col gap-3 overflow-y-auto pr-1.5">
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}

      {isTyping ? (
        <article className="flex justify-start">
          <div className="rounded-2xl rounded-bl-md border border-slate-300/80 bg-white px-3 py-2 shadow-sm shadow-slate-500/10">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
            </div>
          </div>
        </article>
      ) : null}
    </div>
  );
}
