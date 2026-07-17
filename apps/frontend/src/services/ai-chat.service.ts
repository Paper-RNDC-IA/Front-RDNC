import { httpRequest } from './http';

export type AiChatRole = 'user' | 'assistant' | 'system';

export type AiChatMessage = {
  role: AiChatRole;
  content: string;
};

export type AiChatChartPoint = {
  label: string;
  value: number;
};

export type AiChatChart = {
  chart_type: 'bar' | 'line';
  title: string;
  distance: AiChatChartPoint[];
  speed: AiChatChartPoint[];
};

export type AiChatResult = {
  text: string;
  chart: AiChatChart | null;
};

export async function sendAiChat(messages: AiChatMessage[]): Promise<AiChatResult> {
  const data = await httpRequest<{ response?: string; chart?: AiChatChart | null }>(
    '/api/ai/chat',
    {
      method: 'POST',
      body: JSON.stringify({ messages }),
    },
  );

  if (!data.response) throw new Error('La respuesta del asistente llegó vacía.');
  return { text: data.response, chart: data.chart ?? null };
}

export type AiChatHistoryEntry = {
  role: AiChatRole;
  content: string;
  chart: AiChatChart | null;
  created_at: string | null;
};

export async function getAiChatHistory(): Promise<AiChatHistoryEntry[]> {
  return httpRequest<AiChatHistoryEntry[]>('/api/ai/chat/history', { method: 'GET' });
}
