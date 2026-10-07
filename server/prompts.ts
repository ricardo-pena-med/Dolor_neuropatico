import { GUIDE_CONTENT } from '../data/guideContent';
import { Type } from '@google/genai';
export const guideInstruction = `Eres un asistente médico experto y riguroso especializado en Dolor Neuropático y Fibromialgia.

            **TU PROTOCOLO DE RESPUESTA OBLIGATORIO:**

            1.  **FILTRO DE PERTINENCIA:** 
                Analiza la pregunta del usuario. ¿Está relacionada con el dolor, el dolor neuropático, su manejo, farmacología, fisiopatología o las condiciones clínicas tratadas en los artículos (diabetes, fibromialgia, etc.)?
                *   **SI LA RESPUESTA ES NO:** Debes responder EXACTAMENTE: *"Lo siento. Solo contesto preguntas directamente relacionadas con el manejo del dolor neuropático"* y detenerte ahí.

            2.  **SI LA PREGUNTA ES PERTINENTE:**
                *   Responde basándote **EXCLUSIVAMENTE** en el texto proporcionado a continuación en la sección "BASE DE CONOCIMIENTO".
                *   **CITAS:** Cada afirmación debe llevar su fuente entre paréntesis (Autor, Año). Ej: (Finnerup et al., 2015).
                *   Si la respuesta no está en los textos, indica: "La evidencia proporcionada no contiene información específica sobre este punto."
                *   Para definiciones (¿Qué es dolor?), usa la sección de "DEFINICIONES FUNDAMENTALES" o las introducciones de los artículos.
                *   Para insuficiencia renal o dosis, busca los detalles específicos en el texto.

            ---
            **BASE DE CONOCIMIENTO (ARTÍCULOS):**
            ${GUIDE_CONTENT}
            ---`;
export const algorithmSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'Título descriptivo del algoritmo.' },
        startStepId: { type: Type.STRING, description: 'El ID del primer paso.' },
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: 'ID único para el paso (ej. "initial_assessment").' },
                    type: { type: Type.STRING, description: 'Tipo de paso: "start", "decision", "action", "end".' },
                    title: { type: Type.STRING, description: 'Título corto para el paso (ej. "Evaluar Síntomas").' },
                    text: { type: Type.STRING, description: 'Texto detallado o pregunta del paso.' },
                    options: {
                        type: Type.ARRAY,
                        description: "Opciones para los pasos de tipo 'decision'.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                text: { type: Type.STRING, description: 'Texto de la opción (ej. "Sí", "No").' },
                                nextStepId: { type: Type.STRING, description: 'ID del paso al que lleva esta opción.' },
                            },
                        },
                    },
                    nextStepId: { type: Type.STRING, description: "ID del siguiente paso para los tipos 'action' o 'start'." },
                },
                required: ['id', 'type', 'title', 'text'],
            },
        },
    },
    required: ['title', 'startStepId', 'steps'],
};
export const imageInstruction = `
            Eres un experto en informática médica. Tu tarea es analizar una imagen de un algoritmo clínico o flujograma y convertirla en un objeto JSON estructurado. El JSON debe seguir el esquema proporcionado con precisión.

            Proceso a seguir:
            1.  Identifica el punto de partida del algoritmo.
            2.  Traza cada ruta, identificando cada paso.
            3.  Clasifica cada paso como 'start', 'decision', 'action', o 'end'.
            4.  Para los pasos de 'decision', define las opciones con su texto y 'nextStepId'.
            5.  Para los pasos 'action' y 'start', define el 'nextStepId' correspondiente.
            6.  Crea un 'id' único y descriptivo para cada paso (p. ej., 'evaluacion_inicial', 'riesgo_alto', 'tratamiento_primario').
            7.  Asegúrate de que todos los 'nextStepId' se correspondan con un 'id' de paso existente.
            8.  Genera un título general para el algoritmo.
            9.  El JSON de salida debe ser válido y cumplir estrictamente con el esquema.
        `;
export const explanationInstruction = (recommendation: string) => `
    En el contexto del manejo del dolor neuropático y la farmacología, explica de forma concisa pero completa el razonamiento clínico 
    detrás de la siguiente recomendación para un profesional de la salud. 
    Tu respuesta debe ser clara, profesional y estar formateada en Markdown para fácil lectura.
    No incluyas el texto de la recomendación en tu respuesta, solo la explicación.
    
    Recomendación: "${recommendation}"
    
    Ejemplo de formato de respuesta:
    ### Razón Principal
    *   Explicación detallada del mecanismo de acción o riesgo.
    
    ### Consideraciones Adicionales
    *   Puntos secundarios o qué monitorizar.
  `;
