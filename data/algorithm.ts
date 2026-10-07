import { Algorithm } from '../types';

export const TREATMENT_ALGORITHM: Algorithm = {
  title: 'Algoritmo de Tratamiento para Dolor Neuropático',
  startStepId: 'start',
  steps: [
    {
      id: 'start',
      type: 'start',
      title: 'Paso 1: Evaluación y Diagnóstico',
      text: 'Realizar una historia clínica y examen físico completos. Utilizar herramientas de cribado (ej. DN4) para confirmar la presencia de dolor neuropático. Evaluar el impacto en el estado de ánimo, sueño y calidad de vida.',
      nextStepId: 'multidisciplinary_care'
    },
    {
      id: 'multidisciplinary_care',
      type: 'action',
      title: 'Paso 2: Enfoque Multimodal',
      text: 'Considerar la derivación a un equipo multidisciplinario (rehabilitación, psicología, ejercicio). La educación del paciente y las terapias no farmacológicas son la base del tratamiento.',
      nextStepId: 'first_line'
    },
    {
      id: 'first_line',
      type: 'action',
      title: 'Paso 3: Terapia Farmacológica de Primera Línea',
      text: 'Seleccionar un agente de primera línea basado en comorbilidades y perfil de efectos secundarios. Opciones: Antidepresivos Tricíclicos (ADT), ISRS/ISRN, o Gabapentinoides. Realizar una prueba terapéutica de 4-8 semanas, titulando hasta dosis efectiva/tolerada.',
      nextStepId: 'assess_first_line'
    },
    {
      id: 'assess_first_line',
      type: 'decision',
      title: 'Paso 4: Evaluar Respuesta a Primera Línea',
      text: '¿Se ha logrado un alivio significativo del dolor (>30-50%) con efectos adversos tolerables?',
      options: [
        { text: 'Sí, alivio adecuado', nextStepId: 'continue_monitoring' },
        { text: 'Alivio parcial, pero insuficiente', nextStepId: 'second_line_combination' },
        { text: 'No, alivio inadecuado o efectos adversos intolerables', nextStepId: 'second_line_switch' }
      ]
    },
    {
      id: 'continue_monitoring',
      type: 'end',
      title: 'Fin: Continuar y Monitorizar',
      text: 'Mantener el tratamiento actual. Reevaluar periódicamente la eficacia, los efectos adversos y la necesidad de continuar la terapia.'
    },
    {
        id: 'second_line_combination',
        type: 'action',
        title: 'Paso 5a: Terapia de Segunda Línea (Combinación)',
        text: 'Considerar añadir un segundo fármaco de primera línea con un mecanismo de acción diferente (ej. Gabapentinoide + ISRN). Titular lentamente el segundo agente.',
        nextStepId: 'assess_second_line'
    },
    {
        id: 'second_line_switch',
        type: 'action',
        title: 'Paso 5b: Terapia de Segunda Línea (Cambio)',
        text: 'Suspender gradualmente el primer fármaco y cambiar a otro agente de primera línea de una clase diferente. Realizar una nueva prueba de 4-8 semanas.',
        nextStepId: 'assess_second_line'
    },
    {
        id: 'assess_second_line',
        type: 'decision',
        title: 'Paso 6: Evaluar Respuesta a Segunda Línea',
        text: '¿Se ha logrado ahora un alivio satisfactorio del dolor con un perfil de tolerabilidad aceptable?',
        options: [
            { text: 'Sí, alivio adecuado', nextStepId: 'continue_monitoring' },
            { text: 'No, alivio inadecuado o intolerancia', nextStepId: 'third_line' }
        ]
    },
    {
        id: 'third_line',
        type: 'action',
        title: 'Paso 7: Terapia de Tercera Línea y Derivación',
        text: 'Derivar a una Unidad de Dolor. Considerar agentes de tercera línea como Tramadol, Capsaicina 8% en parche para dolor localizado, u otros anticonvulsivantes (ej. Carbamazepina). El uso de opioides fuertes es el último recurso.',
        nextStepId: 'end_specialist'
    },
    {
        id: 'end_specialist',
        type: 'end',
        title: 'Fin: Manejo por Especialista',
        text: 'El paciente requiere manejo avanzado en una unidad especializada, que puede incluir terapias intervencionistas o neuromodulación.'
    }
  ]
};
