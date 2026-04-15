import { useState } from 'react';

import { ChatPanel } from './ChatPanel';
import { type ChatMessage, type ReportResult } from './ChatMessageItem';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'agent',
    content:
      'Hola, soy tu asistente RNDC. Te ayudo a ubicar informacion operativa y sugerir reportes dentro del panel.',
    sentAt: 'Ahora',
  },
];

const REPORT_SAMPLE: ReportResult = {
  title: 'Reporte de rendimiento operativo',
  summary:
    'Concentracion alta de viajes en el corredor central y aumento de tiempos de espera frente al promedio semanal.',
  metrics: [
    { label: 'Viajes evaluados', value: '1.248' },
    { label: 'Cumplimiento ventana', value: '87.4%' },
    { label: 'Desvios activos', value: '42' },
    { label: 'Departamento lider', value: 'Cundinamarca' },
  ],
  actionLabel: 'Ver reporte detallado',
};

function buildAgentReply(question: string): ChatMessage {
  const lowerQuestion = question.toLowerCase();
  const includeReport =
    lowerQuestion.includes('reporte') ||
    lowerQuestion.includes('resumen') ||
    lowerQuestion.includes('comparar');

  return {
    id: `agent-${Date.now()}`,
    role: 'agent',
    content: includeReport
      ? 'Listo. Te comparto una vista previa del reporte y los indicadores clave para que valides rapidamente el estado actual.'
      : 'Entendido. Puedo orientarte por modulo y recomendarte el siguiente paso segun el tipo de consulta operacional que necesites.',
    sentAt: 'Ahora',
    report: includeReport ? REPORT_SAMPLE : undefined,
  };
}

export function ChatWidget(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const sendMessage = (content: string): void => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isTyping) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedContent,
      sentAt: 'Ahora',
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((prev) => [...prev, buildAgentReply(trimmedContent)]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-40 flex flex-col items-end gap-2.5 md:bottom-5 md:right-5">
      <ChatPanel
        open={isOpen}
        messages={messages}
        draft={draft}
        isTyping={isTyping}
        onDraftChange={setDraft}
        onSend={() => sendMessage(draft)}
        onClose={() => setIsOpen(false)}
      />

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-orange-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-[0_10px_22px_rgba(15,23,42,0.14)] transition hover:-translate-y-0.5 hover:bg-orange-50"
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-orange-300 bg-orange-50 text-orange-700">
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M4 4H16V12H8L4 16V4Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>{isOpen ? 'Ocultar asistente' : 'Asistente RNDC'}</span>
      </button>
    </div>
  );
}
