export enum Medication {
  Amitriptyline = 'Amitriptilina',
  Nortriptyline = 'Nortriptilina', // Nueva
  Duloxetine = 'Duloxetina',
  Gabapentin = 'Gabapentina',
  Pregabalin = 'Pregabalina',
  Venlafaxine = 'Venlafaxina',
  Carbamazepine = 'Carbamazepina',
  Capsaicin = 'Capsaicina 8% (Parche)',
  LidocainePatch = 'Lidocaína 5% (Parche)', // Nueva
  Tramadol = 'Tramadol', // Nueva
}

export enum ConcomitantDrug {
    Opioids = 'Opioides',
    SSRIs = 'ISRS (ej. Fluoxetina, Sertralina)',
    Bupropion = 'Bupropión (Inhibidor CYP2D6)',
    Anticoagulants = 'Anticoagulantes (ej. Warfarina)',
}

export type Diagnosis = 'NEUROPATIA_DIABETICA' | 'NEURALGIA_POSTHERPETICA' | 'LUMBALGIA_NEUROPATICA' | 'FIBROMYALGIA';

export type AppFlow = 'HOME' | 'PATIENT_SCENARIO' | 'PHARMACOLOGY_GUIDE' | 'PAIN_PATHWAY_EXPLORER' | 'GUIDE_QA' | 'ALGORITHM_EXPLORER' | 'CLINICAL_SCALES' | 'TITRATION_GUIDE';
export type PatientScenarioState = 'PROFILE_INPUT' | 'ANALYSIS_DASHBOARD' | 'CHECKLIST_VIEW';

export interface PatientProfile {
  diagnosis: Diagnosis;
  painScore: number; // 0-10
  age: number; // Patient's age
  insuficienciaRenal: boolean; // Clearence < 60
  cardiopatia: boolean;
  riesgoSuicida: boolean;
  estrenimiento: boolean;
  glaucoma: boolean;
  hypotensionRisk: boolean;
  somnolencia: boolean; // Daytime sleepiness / fatigue
  concomitantDrugs: ConcomitantDrug[];
}

export type ChecklistLevel = 'danger' | 'warning' | 'success' | 'info';

export interface ChecklistItemData {
  id: string;
  text: string;
  level: ChecklistLevel;
  keyword: string;
}

export interface MedicationAnalysis {
  medication: Medication;
  dangers: ChecklistItemData[];
  warnings: ChecklistItemData[];
  successes: ChecklistItemData[];
  infos: ChecklistItemData[];
}

export interface PharmacologyData {
    pk_pd: string;
    posology: string;
    interactions: string;
    monitoring: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// --- Tipos para el Explorador de Algoritmos ---

export interface AlgorithmStepOption {
  text: string;
  nextStepId: string;
}

export interface AlgorithmStep {
  id: string;
  type: 'start' | 'decision' | 'action' | 'end';
  title: string;
  text: string;
  options?: AlgorithmStepOption[]; // Para tipo 'decision'
  nextStepId?: string; // Para tipo 'action' o 'start'
}

export interface Algorithm {
  title: string;
  startStepId: string;
  steps: AlgorithmStep[];
}