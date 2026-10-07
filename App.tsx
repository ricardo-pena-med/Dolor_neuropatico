
import React, { useState, useMemo, useCallback } from 'react';
import { PatientProfile, PatientScenarioState, Medication, MedicationAnalysis, AppFlow } from './types';
import { analyzeScenario, buildChecklistFromAnalysis } from './services/clinicalAnalysisService';
import { getAdditionalInfo } from './services/geminiService';
import { PHARMACOLOGY_DATA_MAP } from './services/pharmacologyData';
import { DIAGNOSIS_OPTIONS } from './constants';

import Header from './components/Header';
import PatientProfileForm from './components/PatientProfileForm';
import AnalysisDashboard from './components/AnalysisDashboard';
import ChecklistSection from './components/ChecklistSection';
import GeminiInfoModal from './components/GeminiInfoModal';
import GlossaryModal from './components/GlossaryModal';
import HomeScreen from './components/HomeScreen';
import PharmacologyDetailModal from './components/PharmacologyDetailModal';
import PainPathwayExplorer from './components/PainPathwayExplorer';
import GuideQA from './components/GuideQA';
import AlgorithmExplorer from './components/AlgorithmExplorer';
import { SparklesIcon } from './components/icons/SparklesIcon';
import ClinicalScales from './components/ClinicalScales';
import TitrationGuide from './components/TitrationGuide';

type GeminiCache = Record<string, { content: string; isError: boolean }>;

const initialProfile: PatientProfile = {
  diagnosis: 'NEUROPATIA_DIABETICA',
  painScore: 7,
  age: 65,
  insuficienciaRenal: false,
  cardiopatia: false,
  riesgoSuicida: false,
  estrenimiento: false,
  glaucoma: false,
  hypotensionRisk: false,
  somnolencia: false,
  concomitantDrugs: [],
};

export default function App() {
  const [appFlow, setAppFlow] = useState<AppFlow>('HOME');
  const [patientScenarioState, setPatientScenarioState] = useState<PatientScenarioState>('PROFILE_INPUT');
  const [hasScenario, setHasScenario] = useState(false);
  
  const [profile, setProfile] = useState<PatientProfile>(initialProfile);
  const [analysis, setAnalysis] = useState<MedicationAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<MedicationAnalysis | null>(null);
  
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [geminiCache, setGeminiCache] = useState<GeminiCache>({});
  
  const [modalState, setModalState] = useState({ isOpen: false, isLoading: false, content: '', recommendation: '', isError: false });
  const [pharmacologyModalState, setPharmacologyModalState] = useState<{ isOpen: boolean, medication: Medication | null }>({ isOpen: false, medication: null });
  const [titrationModalState, setTitrationModalState] = useState<{ isOpen: boolean, drug: 'gabapentin' | 'pregabalin' }>({ isOpen: false, drug: 'pregabalin' });
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  const handleProfileSubmit = useCallback((submittedProfile: PatientProfile) => {
    setProfile(submittedProfile);
    const scenarioAnalysis = analyzeScenario(submittedProfile);
    setAnalysis(scenarioAnalysis);
    setSelectedAnalysis(null);
    setCheckedItems({});
    setPatientScenarioState('ANALYSIS_DASHBOARD');
  }, []);
  
  const handleSelectMedication = useCallback((medication: Medication) => {
    const selected = analysis.find(a => a.medication === medication);
    if (selected) {
      setSelectedAnalysis(selected);
      const items = buildChecklistFromAnalysis(selected, profile);
      const newCheckedItems: Record<string, boolean> = {};
      items.forEach(item => { newCheckedItems[item.id] = false; });
      setCheckedItems(newCheckedItems);
      setPatientScenarioState('CHECKLIST_VIEW');
    }
  }, [analysis, profile]);

  const handleNewScenario = useCallback(() => {
    setProfile(initialProfile);
    setAnalysis([]);
    setSelectedAnalysis(null);
    setCheckedItems({});
    setPatientScenarioState('PROFILE_INPUT');
    setHasScenario(true);
    setAppFlow('PATIENT_SCENARIO');
  }, []);

  const handleSelectFlow = useCallback((flow: AppFlow) => {
    if (flow === 'PATIENT_SCENARIO') setHasScenario(true);
    setAppFlow(flow);
  }, []);

  const handleProfileChange = useCallback((updatedProfile: PatientProfile) => {
    setProfile(updatedProfile);
  }, []);

  const handleGoToHome = useCallback(() => {
    setAppFlow('HOME');
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setSelectedAnalysis(null);
    setCheckedItems({});
    setPatientScenarioState('ANALYSIS_DASHBOARD');
  }, []);
  
  const handleToggleItem = useCallback((itemId: string) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  }, []);
  
  const handleGetInfo = useCallback(async (recommendation: string) => {
    if (geminiCache[recommendation]) {
      setModalState({ isOpen: true, isLoading: false, ...geminiCache[recommendation], recommendation });
      return;
    }
    setModalState({ isOpen: true, isLoading: true, content: '', recommendation, isError: false });
    const { data, error } = await getAdditionalInfo(recommendation);
    if (!error) setGeminiCache(prev => ({ ...prev, [recommendation]: { content: data, isError: false } }));
    setModalState({ isOpen: true, isLoading: false, content: data, recommendation, isError: error });
  }, [geminiCache]);
  
  const handleViewPharmaDetails = useCallback((medication: Medication) => {
      setPharmacologyModalState({ isOpen: true, medication });
  }, []);

  const handleViewTitration = useCallback((drug: 'gabapentin' | 'pregabalin') => {
      setTitrationModalState({ isOpen: true, drug });
  }, []);

  const handleCloseModal = useCallback(() => setModalState(prev => ({ ...prev, isOpen: false })), []);
  const handleClosePharmaModal = useCallback(() => setPharmacologyModalState({ isOpen: false, medication: null }), []);
  const handleCloseTitrationModal = useCallback(() => setTitrationModalState(prev => ({ ...prev, isOpen: false })), []);
  
  const checklistItems = useMemo(() => {
    return selectedAnalysis ? buildChecklistFromAnalysis(selectedAnalysis, profile) : [];
  }, [selectedAnalysis, profile]);

  const progress = useMemo(() => {
    const total = checklistItems.length;
    const done = Object.values(checkedItems).filter(Boolean).length;
    return { total, done };
  }, [checklistItems, checkedItems]);

  const renderPatientScenario = () => {
    switch(patientScenarioState) {
      case 'PROFILE_INPUT':
        return <PatientProfileForm profile={profile} onChange={handleProfileChange} onSubmit={handleProfileSubmit} />;
      case 'ANALYSIS_DASHBOARD':
        return <AnalysisDashboard analysis={analysis} onSelectMedication={handleSelectMedication} onViewDetails={handleViewPharmaDetails} />;
      case 'CHECKLIST_VIEW':
        return (
          <ChecklistSection 
            items={checklistItems}
            checkedItems={checkedItems}
            onToggleItem={handleToggleItem}
            onGetInfo={handleGetInfo}
            onBackToDashboard={handleBackToDashboard}
            onViewTitration={handleViewTitration}
            scenario={{ diagnosis: profile.diagnosis, medication: selectedAnalysis?.medication ?? '' }}
          />
        );
      default:
        return null;
    }
  }

  const renderContent = () => {
    switch (appFlow) {
        case 'HOME':
            return <HomeScreen hasScenario={hasScenario} onSelectFlow={handleSelectFlow} onViewPharmacology={handleViewPharmaDetails} />;
        case 'PATIENT_SCENARIO':
            return renderPatientScenario();
        case 'PAIN_PATHWAY_EXPLORER':
            return <PainPathwayExplorer />;
        case 'GUIDE_QA':
            return <GuideQA />;
        case 'ALGORITHM_EXPLORER':
            return <AlgorithmExplorer />;
        case 'CLINICAL_SCALES':
            return <ClinicalScales />;
        case 'TITRATION_GUIDE':
            return <TitrationGuide />;
        default:
            return <HomeScreen hasScenario={hasScenario} onSelectFlow={handleSelectFlow} onViewPharmacology={handleViewPharmaDetails}/>;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header 
          progress={progress}
          showProgress={appFlow === 'PATIENT_SCENARIO' && patientScenarioState === 'CHECKLIST_VIEW'}
          showHomeButton={appFlow !== 'HOME'}
          onGoToHome={handleGoToHome}
          onGlossaryClick={() => setIsGlossaryOpen(true)}
          onPainPathwayExplorerClick={() => setAppFlow('PAIN_PATHWAY_EXPLORER')}
        />
        
        <main>
          {appFlow === 'PATIENT_SCENARIO' && (
            <section aria-label="Escenario actual" className="mb-6 rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-blue-900">Escenario actual</h2>
                <p className="mt-1 text-sm text-slate-700">
                  {DIAGNOSIS_OPTIONS.find(option => option.id === profile.diagnosis)?.name}
                  {' · '}{profile.age} años{' · '}Dolor {profile.painScore}/10
                </p>
                <p className="mt-1 text-xs text-slate-500">Puede consultar otras herramientas y retomar este escenario.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {patientScenarioState !== 'PROFILE_INPUT' && (
                  <button type="button" onClick={() => setPatientScenarioState('PROFILE_INPUT')} className="px-3 py-2 text-sm font-medium text-blue-800 border border-blue-200 rounded-md hover:bg-blue-50">
                    Editar datos
                  </button>
                )}
                <button type="button" onClick={handleNewScenario} className="px-3 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50">
                  Nuevo escenario
                </button>
              </div>
            </section>
          )}
          {renderContent()}
        </main>

        <footer className="text-center text-xs text-slate-500 border-t border-slate-200 pt-6 pb-8 mt-8">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            
            <div className="flex flex-col items-center gap-2">
               <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                 Prueba de Concepto (PoC)
               </h3>
               <div className="flex items-center gap-2 text-slate-600">
                 <SparklesIcon className="w-4 h-4" />
                 <span>Basado en literatura científica (AAN, EULAR, NeuPSIG) con fines demostrativos.</span>
               </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-900 text-xs leading-relaxed max-w-3xl mx-auto">
              <p className="font-bold mb-1">⚠️ AVISO LEGAL Y REGULATORIO:</p>
              <p>
                Esta aplicación es un prototipo experimental y <strong>NO ha sido revisada, certificada ni aprobada por el INVIMA</strong> ni por ninguna otra entidad regulatoria sanitaria.
                <strong>NO tiene el propósito de funcionar como un Sistema de Soporte a la Decisión Clínica (CDSS) real</strong> ni constituye un dispositivo médico.
                Su uso es exclusivamente educativo y para demostración tecnológica. La información aquí presentada no sustituye el juicio clínico profesional ni las guías oficiales vigentes.
              </p>
            </div>

            <p className="text-slate-400 pt-2">
              Desarrollado por Dr. Ricardo A. Peña, MD, PhD. © 2025.
            </p>
          </div>
        </footer>
      </div>
      
      <GeminiInfoModal
        isOpen={modalState.isOpen}
        isLoading={modalState.isLoading}
        content={modalState.content}
        recommendation={modalState.recommendation}
        isError={modalState.isError}
        onClose={handleCloseModal}
      />
      <GlossaryModal 
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
      {pharmacologyModalState.isOpen && pharmacologyModalState.medication && (
          <PharmacologyDetailModal
            isOpen={pharmacologyModalState.isOpen}
            medication={pharmacologyModalState.medication}
            pharmacologyData={PHARMACOLOGY_DATA_MAP[pharmacologyModalState.medication]}
            onClose={handleClosePharmaModal}
          />
      )}
      
      {/* Titration Modal Reuse */}
      {titrationModalState.isOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 transition-opacity"
            onClick={handleCloseTitrationModal}
        >
             <div 
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all max-h-[90vh] overflow-y-auto p-1"
                onClick={(e) => e.stopPropagation()}
             >
                 <div className="p-2 flex justify-end">
                     <button onClick={handleCloseTitrationModal} className="text-slate-400 hover:text-slate-600">✕</button>
                 </div>
                 <TitrationGuide initialDrug={titrationModalState.drug} />
                 <div className="p-4 text-center">
                    <button onClick={handleCloseTitrationModal} className="px-4 py-2 bg-blue-800 text-white rounded-md">Cerrar</button>
                 </div>
             </div>
        </div>
      )}
    </div>
  );
}
