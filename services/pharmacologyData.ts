import { Medication, PharmacologyData } from '../types';

export const PHARMACOLOGY_DATA_MAP: Record<Medication, PharmacologyData> = {
  [Medication.Amitriptyline]: {
    pk_pd: `
### Farmacodinámica (PD)
*   **Mecanismo:** Antidepresivo tricíclico (ADT). Inhibe la recaptación de noradrenalina (NE) y serotonina (5-HT), potenciando las vías inhibitorias descendentes del dolor.
*   **Acción Adicional:** Bloquea receptores muscarínicos (anticolinérgico), histamínicos H1 (sedación) y adrenérgicos alfa-1 (hipotensión). Perfil de efectos adversos significativo.

### Farmacocinética (PK)
*   **Metabolismo:** Hepático (CYP2D6) a nortriptilina (metabolito activo).
*   **Excreción:** Renal.
*   **Vida Media:** 10-50 horas.
    `,
    posology: `
### Adultos
*   **Dosis Inicial:** 10-25 mg noche.
*   **Titulación:** +10-25 mg cada 3-7 días.
*   **Dosis Objetivo:** 25-75 mg/día (máx 150 mg).
*   **Ancianos:** No recomendada (Criterios Beers). Preferir Nortriptilina.
    `,
    interactions: `
### Interacciones
*   **Inhibidores CYP2D6:** Aumentan toxicidad.
*   **Serotoninérgicos:** Riesgo síndrome serotoninérgico.
*   **Anticolinérgicos:** Suma de efectos adversos.
    `,
    monitoring: `
*   **ECG:** Basal en >40 años o riesgo cardíaco (QTc).
*   **Efectos:** Boca seca, estreñimiento, hipotensión ortostática.
    `
  },
  [Medication.Nortriptyline]: {
    pk_pd: `
### Farmacodinámica (PD)
*   **Mecanismo:** Metabolito secundario de la amitriptilina. Inhibe preferentemente la recaptación de Noradrenalina.
*   **Ventaja:** Menor afinidad por receptores histamínicos, muscarínicos y alfa-adrenérgicos que la amitriptilina, lo que resulta en **menos sedación, menos efectos anticolinérgicos y menos hipotensión**.

### Farmacocinética (PK)
*   **Ventana Terapéutica:** Existe una "ventana terapéutica" en niveles plasmáticos para depresión, posiblemente aplicable a dolor.
*   **Vida Media:** 18-44 horas.
    `,
    posology: `
### Adultos y Ancianos
*   **Dosis Inicial:** 10-25 mg noche.
*   **Titulación:** Aumentar gradualmente.
*   **Dosis Objetivo:** 50-75 mg/día. Suele ser mejor tolerada en dosis hasta 100mg.
    `,
    interactions: `
### Interacciones
*   Similar a amitriptilina pero con menor intensidad.
*   Precaución con inhibidores CYP2D6.
    `,
    monitoring: `
*   **Seguridad:** Preferida en ancianos sobre amitriptilina.
*   **Cardiovascular:** Monitorizar PA y ECG en pacientes de riesgo.
    `
  },
  [Medication.Duloxetine]: {
    pk_pd: `
### Farmacodinámica (PD)
*   **Mecanismo:** ISRN equilibrado. Potencia inhibición descendente.
*   **Selectividad:** Mínima acción en otros receptores.

### Farmacocinética (PK)
*   **Metabolismo:** CYP1A2 y CYP2D6.
*   **Excreción:** Renal.
    `,
    posology: `
### Adultos
*   **Inicio:** 30 mg/día x 1 semana.
*   **Mantenimiento:** 60 mg/día.
*   **Máximo:** 120 mg/día (sin mayor beneficio claro en dolor).
*   **Renal:** Contraindicado si ClCr < 30 mL/min.
    `,
    interactions: `
*   **Inhibidores CYP1A2:** Aumentan niveles.
*   **Serotoninérgicos:** Riesgo síndrome serotoninérgico.
    `,
    monitoring: `
*   **PA:** Monitorizar presión arterial.
*   **Hígado:** Evitar en insuficiencia hepática.
    `
  },
  [Medication.Venlafaxine]: {
    pk_pd: `
### Farmacodinámica (PD)
*   **Mecanismo:** ISRN dosis-dependiente. A dosis bajas (<150mg) actúa como ISRS; a dosis altas inhibe recaptación de Noradrenalina (efecto analgésico).

### Farmacocinética (PK)
*   **Metabolismo:** CYP2D6.
    `,
    posology: `
### Adultos
*   **Inicio:** 37.5 - 75 mg.
*   **Eficacia Analgésica:** Generalmente requiere **≥ 150 mg/día**.
*   **Retirada:** Síndrome de abstinencia marcado si se suspende abruptamente.
    `,
    interactions: `
*   Síndrome serotoninérgico con otros agentes.
    `,
    monitoring: `
*   **PA:** Hipertensión dosis-dependiente.
*   **ECG:** Precaución en riesgo cardíaco a dosis altas.
    `
  },
  [Medication.Gabapentin]: {
    pk_pd: `
### Farmacodinámica (PD)
*   **Mecanismo:** Ligando alfa-2-delta. Reduce entrada de Calcio y liberación de neurotransmisores excitatorios (Glutamato, Sustancia P).

### Farmacocinética (PK)
*   **Absorción:** Saturable (no lineal). Dosis altas tienen menor biodisponibilidad.
*   **Excreción:** 100% Renal sin cambios.
    `,
    posology: `
### Adultos
*   **Inicio:** 300 mg/día. Titulación rápida (300->600->900).
*   **Rango:** 1200-3600 mg/día (en 3 tomas).
*   **Renal:** Ajuste obligatorio ClCr < 60.
    `,
    interactions: `
*   **Opioides:** Sedación profunda.
*   **Antiácidos:** Reducen absorción.
    `,
    monitoring: `
*   **SNC:** Sedación, mareo, ataxia, edema periférico.
    `
  },
  [Medication.Pregabalin]: {
    pk_pd: `
### Farmacodinámica (PD)
*   **Mecanismo:** Ligando alfa-2-delta (mayor afinidad que gabapentina).

### Farmacocinética (PK)
*   **Absorción:** Lineal (predecible). Biodisponibilidad >90%.
*   **Excreción:** 100% Renal.
    `,
    posology: `
### Adultos
*   **Inicio:** 75 mg BID o 50 mg TID.
*   **Rango:** 300-600 mg/día.
*   **Renal:** Ajuste obligatorio ClCr < 60.
    `,
    interactions: `
*   Potenciación de sedantes (Opioides, Alcohol, BZD).
    `,
    monitoring: `
*   **SNC:** Sedación, mareo.
*   **Otros:** Aumento de peso, edema.
    `
  },
  [Medication.LidocainePatch]: {
    pk_pd: `
### Farmacodinámica (PD)
*   **Mecanismo:** Bloqueo de canales de sodio voltaje-dependientes en las neuronas aferentes primarias dañadas (ectópicas) bajo el parche.
*   **Acción:** Local/Periférica. Mínima absorción sistémica.

### Farmacocinética (PK)
*   **Absorción:** <3-5% sistémico. Niveles plasmáticos insignificantes.
    `,
    posology: `
### Uso Tópico
*   **Aplicación:** Cubrir el área dolorosa (máximo 3 parches simultáneos).
*   **Régimen:** 12 horas puesto / 12 horas descanso (para evitar taquifilaxia y riesgo sistémico, aunque algunos estudios sugieren seguridad con uso prolongado).
*   **Indicación:** Ideal para dolor localizado y alodinia.
    `,
    interactions: `
*   Mínimas. Seguro en polimedicados.
    `,
    monitoring: `
*   **Piel:** Irritación local, eritema. No aplicar sobre heridas abiertas.
    `
  },
  [Medication.Capsaicin]: {
    pk_pd: `
### Farmacodinámica (PD)
*   **Mecanismo:** Agonista TRPV1. Defuncionalización reversible de fibras nociceptivas C ("poda química").

### Farmacocinética (PK)
*   Mínima absorción sistémica.
    `,
    posology: `
### Parche 8%
*   **Aplicación:** Única vez en clínica (30-60 min) previa anestesia tópica.
*   **Duración:** Alivio hasta 3 meses. Repetir cada 90 días.
    `,
    interactions: `
*   Ninguna sistémica relevante.
    `,
    monitoring: `
*   **Aplicación:** Dolor urente intenso durante procedimiento (requiere manejo). Hipertensión transitoria por dolor.
    `
  },
  [Medication.Tramadol]: {
    pk_pd: `
### Farmacodinámica (PD)
*   **Mecanismo Dual:** 1) Agonista mu-opioide débil. 2) Inhibidor recaptación serotonina y noradrenalina.
*   **Eficacia:** Segunda línea o rescate.

### Farmacocinética (PK)
*   **Metabolismo:** Hepático (CYP2D6) a metabolito activo (M1).
    `,
    posology: `
### Adultos
*   **Inicio:** 50 mg/día. Titular lento.
*   **Mantenimiento:** 50-100 mg cada 4-6h.
*   **Máximo:** 400 mg/día (300 mg en ancianos).
*   **Renal/Hepático:** Ajustar intervalo (cada 12h).
    `,
    interactions: `
*   **Serotoninérgicos:** Riesgo síndrome serotoninérgico.
*   **Hipoglucemiantes:** Riesgo hipoglucemia.
*   **Umbral convulsivo:** Reduce umbral (evitar en epilepsia).
    `,
    monitoring: `
*   **Seguridad:** Estreñimiento, náuseas, mareo. Riesgo de abuso (bajo, pero existente). Evitar uso crónico prolongado sin revisión.
    `
  },
  [Medication.Carbamazepine]: {
    pk_pd: `
### Farmacodinámica (PD)
*   **Mecanismo:** Bloqueo canales Na+.
*   **Indicación:** Única 1ª línea en Neuralgia del Trigémino. Pobre evidencia en otros dolores neuropáticos.
    `,
    posology: `
### Trigémino
*   **Inicio:** 100-200 mg/día.
*   **Rango:** 200-1200 mg/día.
    `,
    interactions: `
*   **Inductor CYP3A4 Potente:** Múltiples interacciones (ACO, Warfarina, etc).
    `,
    monitoring: `
*   **Grave:** Stevens-Johnson (gen HLA-B*1502 en asiáticos), Agranulocitosis, Hiponatremia.
    `
  }
};