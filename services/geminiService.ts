import type { Algorithm, ChatMessage } from '../types';

async function requestGemini(payload: unknown): Promise<string> {
  const response = await fetch('/api/gemini', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'No se pudo obtener la respuesta de Gemini.');
  return result.text;
}

export async function getAIStatus(): Promise<boolean> {
  const response = await fetch('/api/ai-status');
  if (!response.ok) throw new Error('No se pudo comprobar la conexión del asistente.');
  const result = await response.json();
  return result.configured === true;
}

export async function getAdditionalInfo(recommendation: string): Promise<{ data: string; error: boolean }> {
  try {
    return { data: await requestGemini({ mode: 'explanation', recommendation }), error: false };
  } catch (error) {
    return { data: error instanceof Error ? error.message : 'No se pudo consultar Gemini.', error: true };
  }
}

export async function getGuideAnswer(messages: ChatMessage[]): Promise<string> {
  return requestGemini({ mode: 'guide', messages });
}

export async function generateAlgorithmFromImage(base64Image: string, mimeType: string): Promise<{ data: Algorithm | null; error: string | null }> {
  try {
    const text = await requestGemini({ mode: 'algorithm', base64Image, mimeType });
    return { data: JSON.parse(text) as Algorithm, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'No se pudo interpretar la imagen.' };
  }
}
