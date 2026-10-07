import { GoogleGenAI } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { algorithmSchema, explanationInstruction, guideInstruction, imageInstruction } from './prompts';

export function geminiPlugin(env: Record<string, string>): Plugin {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  const model = env.GEMINI_MODEL || 'gemini-2.5-flash';
  const middleware = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const path = req.url?.split('?')[0];
    if (path !== '/api/ai-status' && path !== '/api/gemini') return next();
    const send = (status: number, data: unknown) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(data));
    };
    if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) {
      return send(403, { error: 'Origen no autorizado.' });
    }
    if (path === '/api/ai-status' && req.method === 'GET') {
      return send(200, { configured: Boolean(apiKey) });
    }
    if (req.method !== 'POST' || path !== '/api/gemini') return send(405, { error: 'Método no permitido.' });
    if (!apiKey) return send(503, { error: 'Gemini está pendiente de configuración. Las demás herramientas de la plataforma están disponibles.' });
    if (!req.headers['content-type']?.startsWith('application/json')) return send(415, { error: 'Formato no admitido.' });
    try {
      let body = '';
      for await (const chunk of req) {
        body += chunk.toString();
        if (Buffer.byteLength(body) > 8_000_000) return send(413, { error: 'La solicitud es demasiado grande.' });
      }
      let payload;
      try { payload = JSON.parse(body); } catch { return send(400, { error: 'Solicitud inválida.' }); }
      if (!payload || typeof payload !== 'object') return send(400, { error: 'Solicitud inválida.' });
      const ai = new GoogleGenAI({ apiKey });
      let response;
      switch (payload.mode) {
        case 'explanation': {
          if (typeof payload.recommendation !== 'string' || payload.recommendation.length > 16_000) {
            return send(400, { error: 'Recomendación inválida.' });
          }
          response = await ai.models.generateContent({ model,
            contents: explanationInstruction(payload.recommendation),
            config: { temperature: 0.2, topP: 0.95 },
          });
          break;
        }
        case 'guide': {
          if (!Array.isArray(payload.messages) || !payload.messages.length || payload.messages.length > 100 ||
            payload.messages.some((m: { role?: string; text?: string } | null) => !m || !['user', 'model'].includes(m.role || '') || typeof m.text !== 'string' || m.text.length > 16_000)) {
            return send(400, { error: 'Conversación inválida.' });
          }
          const messages = payload.messages[0].role === 'model' ? payload.messages.slice(1) : payload.messages;
          response = await ai.models.generateContent({ model,
            contents: messages.map((m: { role: string; text: string }) => ({ role: m.role, parts: [{ text: m.text }] })),
            config: { systemInstruction: guideInstruction, temperature: 0.1 },
          });
          break;
        }
        case 'algorithm': {
          if (typeof payload.base64Image !== 'string' || !['image/png', 'image/jpeg', 'image/webp'].includes(payload.mimeType)) {
            return send(400, { error: 'Imagen inválida.' });
          }
          response = await ai.models.generateContent({ model,
            contents: { parts: [{ text: imageInstruction }, { inlineData: { mimeType: payload.mimeType, data: payload.base64Image } }] },
            config: { responseMimeType: 'application/json', responseSchema: algorithmSchema, temperature: 0.1 },
          });
          break;
        }
        default: return send(400, { error: 'Modo no reconocido.' });
      }
      if (!response.text) return send(502, { error: 'Gemini no devolvió una respuesta. Inténtelo de nuevo.' });
      send(200, { text: response.text });
    } catch {
      send(502, { error: 'No se pudo consultar Gemini. Compruebe la configuración y la conexión.' });
    }
  };
  return {
    name: 'local-gemini-api',
    configureServer(server) { server.middlewares.use(middleware); },
    configurePreviewServer(server) { server.middlewares.use(middleware); },
  };
}
