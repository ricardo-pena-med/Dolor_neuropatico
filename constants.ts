import { Diagnosis, ConcomitantDrug } from './types';

export const DIAGNOSIS_OPTIONS: { id: Diagnosis; name: string; description: string }[] = [
    { id: 'NEUROPATIA_DIABETICA', name: 'Neuropatía Diabética Dolorosa', description: 'Dolor, ardor o parestesias en distribución de guante/calcetín.' },
    { id: 'NEURALGIA_POSTHERPETICA', name: 'Neuralgia Postherpética', description: 'Dolor persistente en un dermatoma tras un episodio de herpes zóster.' },
    { id: 'LUMBALGIA_NEUROPATICA', name: 'Lumbalgia Neuropática', description: 'Dolor lumbar que se irradia a miembros inferiores (ciática).' },
    { id: 'FIBROMYALGIA', name: 'Fibromialgia', description: 'Dolor musculoesquelético generalizado, fatiga y sensibilidad.'}
];

export const CONCOMITANT_DRUGS_OPTIONS: { id: ConcomitantDrug, label: string }[] = [
    { id: ConcomitantDrug.Opioids, label: 'Opioides (Tramadol, Morfina, etc.)' },
    { id: ConcomitantDrug.SSRIs, label: 'ISRS (Fluoxetina, Sertralina)' },
    { id: ConcomitantDrug.Bupropion, label: 'Bupropión' },
    { id: ConcomitantDrug.Anticoagulants, label: 'Anticoagulantes' },
];