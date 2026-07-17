import { useEffect, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { getStoredSession } from '../services/auth.service';
import { getAiChatHistory, sendAiChat } from '../services/ai-chat.service';
import type { AiChatChart, AiChatChartPoint, AiChatMessage } from '../services/ai-chat.service';

type UiMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chart?: AiChatChart | null;
};

// Recharts <ResponsiveContainer> mide 0x0 al montar dentro de un mensaje de chat que
// se agrega dinamicamente a una lista con scroll; dimensiones fijas evitan ese bug.
function MiniChart({
  title,
  data,
  type,
  color,
}: {
  title: string;
  data: AiChatChartPoint[];
  type: 'bar' | 'line';
  color: string;
}): JSX.Element {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="mb-2 text-xs font-semibold text-slate-600">{title}</p>
      {data.length === 0 ? (
        <p className="text-xs text-slate-400">Sin datos.</p>
      ) : type === 'bar' ? (
        <BarChart width={280} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      ) : (
        <LineChart width={280} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      )}
    </div>
  );
}

function ChatChart({ chart }: { chart: AiChatChart }): JSX.Element {
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      <MiniChart
        title={`${chart.title} — Distancia (km)`}
        data={chart.distance}
        type={chart.chart_type}
        color="#f97316"
      />
      <MiniChart
        title={`${chart.title} — Velocidad (km/h)`}
        data={chart.speed}
        type={chart.chart_type}
        color="#0ea5e9"
      />
    </div>
  );
}

function MessageBubble({ msg }: { msg: UiMessage }): JSX.Element {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={[
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
          isUser
            ? 'bg-orange-500 text-white rounded-br-sm'
            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm',
        ].join(' ')}
      >
        {!isUser ? (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-orange-500">
            Asistente IA
          </p>
        ) : null}
        {msg.content}
        {!isUser ? (
          <p className="mt-2 border-t border-slate-100 pt-2 text-[11px] italic leading-snug text-slate-400">
            Esta respuesta se generó automáticamente a partir de los datos de tu empresa y del RNDC.
            Puede contener errores de interpretación del modelo: verifica las cifras importantes
            antes de tomar decisiones operativas. El Asistente IA es una herramienta de apoyo, no
            reemplaza el criterio de un profesional de logística.
          </p>
        ) : null}
      </div>
      {!isUser && msg.chart ? (
        <div className="mt-2 w-full max-w-2xl">
          <ChatChart chart={msg.chart} />
        </div>
      ) : null}
    </div>
  );
}

const SUGGESTIONS = [
  '¿Cuántos viajes registré el mes pasado?',
  '¿Cuál es el resumen de mis rutas GPS?',
  'Explícame el análisis de nodos de parada GPS',
  '¿Cómo va mi empresa respecto al promedio nacional?',
];

export function CompanyChatPage(): JSX.Element {
  const session = getStoredSession();
  const companyName = session?.companyName ?? 'tu empresa';
  const companyNit = session?.companyNit ?? '';

  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    getAiChatHistory()
      .then((history) => {
        if (!active) return;
        setMessages(
          history.map((entry, index) => ({
            id: `h-${index}`,
            role: entry.role === 'user' ? 'user' : 'assistant',
            content: entry.content,
            chart: entry.chart,
          })),
        );
      })
      .catch(() => {
        // Sin historial previo o error de red: se empieza con el chat vacío.
      })
      .finally(() => {
        if (active) setLoadingHistory(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(): Promise<void> {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: UiMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);
    setError(null);

    try {
      const history: AiChatMessage[] = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: text },
      ];

      const reply = await sendAiChat(history);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', content: reply.text, chart: reply.chart },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con el asistente.';
      setError(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="flex h-[calc(100vh-4rem)] flex-col space-y-0" id="company-chat">
      {/* Header */}
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5 mb-4 flex-shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
              Portal Privado · Asistente IA
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{companyName}</h2>
            {companyNit ? <p className="mt-0.5 text-sm text-slate-500">NIT: {companyNit}</p> : null}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs font-medium text-slate-600">IA activa · Llama 3.3 70B</span>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {loadingHistory ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-400">Cargando historial...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-orange-100 p-5">
                <svg
                  viewBox="0 0 24 24"
                  className="h-10 w-10 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  />
                </svg>
              </div>
              <p className="text-base font-semibold text-slate-700">¿En qué te puedo ayudar hoy?</p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Pregunta sobre tus manifiestos, estadísticas de vehículos, rutas GPS o emisiones
                CO₂. El asistente consulta tus datos reales para responderte.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setInput(suggestion)}
                    className="rounded-xl border border-orange-200 bg-white px-3 py-2 text-left text-xs text-slate-600 hover:border-orange-400 hover:bg-orange-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
          )}

          {sending ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:300ms]" />
              </div>
            </div>
          ) : null}

          <div ref={bottomRef} />
        </div>

        {/* Error */}
        {error ? (
          <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
            {error}
          </div>
        ) : null}

        {/* Input */}
        <div className="flex-shrink-0 border-t border-slate-200 bg-white px-4 py-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              placeholder="Escribe tu pregunta... (Enter para enviar, Shift+Enter para nueva línea)"
              rows={2}
              disabled={sending}
              className="flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={sending || !input.trim()}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              aria-label="Enviar mensaje"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Powered by Groq · Llama 3.3 70B Versatile · Respuestas generadas por IA, verifica datos
            importantes.
          </p>
        </div>
      </div>
    </section>
  );
}
