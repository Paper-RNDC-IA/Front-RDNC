import { ReportResultCard } from './ReportResultCard';

export type ReportResultMetric = {
  label: string;
  value: string;
};

export type ReportResult = {
  title: string;
  summary: string;
  metrics: ReportResultMetric[];
  actionLabel?: string;
};

export type ChatRole = 'user' | 'agent';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  sentAt: string;
  report?: ReportResult;
};

type ChatMessageItemProps = {
  message: ChatMessage;
};

export function ChatMessageItem({ message }: ChatMessageItemProps): JSX.Element {
  const isUser = message.role === 'user';

  return (
    <article className={['flex', isUser ? 'justify-end' : 'justify-start'].join(' ')}>
      <div
        className={[
          'max-w-[88%] rounded-2xl px-3 py-2 shadow-md',
          isUser
            ? 'rounded-br-md border border-orange-300 bg-orange-50 text-slate-800 shadow-orange-200/30'
            : 'rounded-bl-md border border-zinc-300 bg-white text-slate-700 shadow-zinc-300/30',
        ].join(' ')}
      >
        <p className="text-[13px] leading-relaxed">{message.content}</p>
        {message.report ? <ReportResultCard report={message.report} /> : null}
        <p className={['mt-1 text-[10px]', isUser ? 'text-slate-500' : 'text-slate-500'].join(' ')}>
          {message.sentAt}
        </p>
      </div>
    </article>
  );
}
