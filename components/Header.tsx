import React from 'react';
import { BrainIcon } from './icons/BrainIcon';

interface HeaderProps {
  progress: { done: number; total: number };
  showProgress: boolean;
  showHomeButton: boolean;
  onGoToHome: () => void;
  onGlossaryClick: () => void;
  onPainPathwayExplorerClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ progress, showProgress, showHomeButton, onGoToHome, onGlossaryClick, onPainPathwayExplorerClick }) => {
  const percentage = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <header className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 cursor-pointer" onClick={onGoToHome}>
          <div className="bg-red-700 text-white p-3 rounded-full">
            <BrainIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Clínica de Dolor Neuropático</h1>
            <p className="text-slate-500">Plataforma de Decisión y Educación</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto self-end sm:self-center">
          <button 
            onClick={onGlossaryClick}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-100 flex-1 sm:flex-initial"
            title="Glosario"
          >
            <span className="sm:inline">Glosario</span>
          </button>
           <button 
            onClick={onPainPathwayExplorerClick}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-100 flex-1 sm:flex-initial"
            title="Explorador de Vías del Dolor"
          >
            <div className="bg-red-700 text-white p-1 rounded-full">
              <BrainIcon className="w-4 h-4"/>
            </div>
            <span className="hidden sm:inline">Vías del Dolor</span>
          </button>
           {showHomeButton && (
             <button 
                onClick={onGoToHome}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-800 border border-transparent rounded-md shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Inicio
              </button>
           )}
        </div>
      </div>
       {showProgress && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 w-full">
            <div className="flex justify-between items-center mb-1">
               <span className="text-sm font-medium text-slate-700">Progreso del Plan de Acción</span>
               <span className="text-sm font-bold text-blue-800">{progress.done} / {progress.total}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div 
                className="bg-blue-800 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${percentage}%` }}
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}
    </header>
  );
};

export default Header;