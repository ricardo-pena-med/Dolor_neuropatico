import React from 'react';
import { AppFlow, Medication } from '../types';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { PillIcon } from './icons/PillIcon';
import { BrainIcon } from './icons/BrainIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ChartBarSquareIcon } from './icons/ChartBarSquareIcon';
import { PHARMACOLOGY_DATA_MAP } from '../services/pharmacologyData';
import { ScaleIcon } from './icons/ScaleIcon';
import { BarsArrowUpIcon } from './icons/BarsArrowUpIcon';

interface HomeScreenProps {
  hasScenario: boolean;
  onSelectFlow: (flow: AppFlow) => void;
  onViewPharmacology: (medication: Medication) => void;
}

const FlowCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-6 bg-white rounded-xl shadow-lg border border-transparent hover:border-blue-800 hover:shadow-xl transition-all flex items-center gap-6"
  >
    <div className="bg-red-700 text-white p-4 rounded-full">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-lg text-blue-900">{title}</h3>
      <p className="text-slate-600 mt-1">{description}</p>
    </div>
  </button>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ hasScenario, onSelectFlow, onViewPharmacology }) => {
  const medications = Object.keys(PHARMACOLOGY_DATA_MAP) as Medication[];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-blue-900 sm:text-3xl">Bienvenido a la Plataforma de Dolor Neuropático</h2>
        <p className="mt-3 text-lg text-slate-600">Elija su punto de partida para comenzar.</p>
      </div>

      <div className="space-y-6">
        <FlowCard
          icon={<UserCircleIcon className="w-8 h-8" />}
          title={hasScenario ? 'Retomar escenario' : 'Analizar Escenario de Paciente'}
          description={hasScenario ? 'Continúe con los datos y el plan que estaba revisando.' : 'Ingrese el perfil de un paciente para recibir un análisis de opciones de tratamiento y manejo de comorbilidades.'}
          onClick={() => onSelectFlow('PATIENT_SCENARIO')}
        />
        <FlowCard
          icon={<ChartBarSquareIcon className="w-8 h-8" />}
          title="Explorador de Algoritmo de Tratamiento"
          description="Navegue por un algoritmo de tratamiento interactivo basado en las últimas guías clínicas para la toma de decisiones."
          onClick={() => onSelectFlow('ALGORITHM_EXPLORER')}
        />
        <FlowCard
          icon={<DocumentTextIcon className="w-8 h-8" />}
          title="Consultar Guías Clínicas con IA"
          description="Haga preguntas directamente sobre las guías clínicas pre-cargadas para obtener respuestas rápidas basadas en evidencia."
          onClick={() => onSelectFlow('GUIDE_QA')}
        />
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-50 px-3 text-base font-semibold leading-6 text-blue-900">Herramientas Clínicas</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FlowCard
          icon={<ScaleIcon className="w-8 h-8" />}
          title="Escalas Clínicas Interactivas"
          description="Utilice las escalas NRS, DN4 y BPI para evaluar al paciente y obtener una puntuación e interpretación al instante."
          onClick={() => onSelectFlow('CLINICAL_SCALES')}
        />
        <FlowCard
          icon={<BarsArrowUpIcon className="w-8 h-8" />}
          title="Guía de Titulación de Gabapentinoides"
          description="Consulte pautas prácticas para la titulación de dosis de Gabapentina y Pregabalina."
          onClick={() => onSelectFlow('TITRATION_GUIDE')}
        />
      </div>


      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-50 px-3 text-base font-semibold leading-6 text-blue-900">Otras Herramientas</span>
        </div>
      </div>

       <div className="space-y-4">
            <div className="text-center">
                 <h3 className="font-bold text-lg text-blue-900 flex items-center justify-center gap-3">
                    <div className="bg-red-700 text-white p-2 rounded-full">
                        <PillIcon className="w-5 h-5"/>
                    </div>
                    Guía Farmacológica Rápida
                </h3>
                 <p className="text-slate-600 mt-1">Consulte la monografía detallada de un medicamento específico.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {medications.map(med => (
                    <button
                        key={med}
                        onClick={() => onViewPharmacology(med)}
                        className="w-full p-4 bg-white rounded-lg shadow-md border border-transparent hover:border-blue-800 hover:shadow-lg transition-all font-medium text-slate-800"
                    >
                        {med}
                    </button>
                ))}
            </div>
       </div>

       <div className="pt-4">
         <FlowCard
            icon={<BrainIcon className="w-8 h-8" />}
            title="Explorador Interactivo de Vías del Dolor"
            description="Visualice las vías ascendentes/descendentes del dolor y cómo los fármacos modulan la neurotransmisión."
            onClick={() => onSelectFlow('PAIN_PATHWAY_EXPLORER')}
         />
       </div>

    </div>
  );
};

export default HomeScreen;
