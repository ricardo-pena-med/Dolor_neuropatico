
import React from 'react';
import { MedicationAnalysis, ChecklistItemData, ChecklistLevel } from '../types';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { InfoIcon } from './icons/InfoIcon';

interface MedicationCardProps {
  analysis: MedicationAnalysis;
  onSelect: () => void;
  onViewDetails: () => void;
}

const getSectionStyle = (level: ChecklistLevel) => {
    switch (level) {
        case 'danger': return { icon: <ShieldExclamationIcon className="w-5 h-5 text-red-600" />, title: 'Peligros / Contraindicado', textColor: 'text-red-900' };
        case 'warning': return { icon: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />, title: 'Precauciones', textColor: 'text-yellow-900' };
        case 'success': return { icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />, title: 'Beneficios / Indicado', textColor: 'text-green-900' };
        case 'info': return { icon: <InfoIcon className="w-5 h-5 text-sky-600" />, title: 'Información', textColor: 'text-sky-900' };
    }
};

const AnalysisSection: React.FC<{ level: ChecklistLevel, items: ChecklistItemData[] }> = ({ level, items }) => {
    if (items.length === 0) return null;
    const { icon, title, textColor } = getSectionStyle(level);

    return (
        <div className="mb-3 last:mb-0">
            <h4 className={`flex items-center gap-2 text-sm font-bold ${textColor} uppercase tracking-wide text-xs mb-1`}>
                {icon}
                {title}
            </h4>
            <ul className="space-y-1.5 pl-2">
                {items.map(item => (
                    <li key={item.id} className={`text-sm pl-2 border-l-2 ${level === 'danger' ? 'border-red-300 text-red-800' : level === 'warning' ? 'border-yellow-300 text-yellow-800' : level === 'success' ? 'border-green-300 text-green-800' : 'border-sky-300 text-sky-800'}`}>
                        <span className="font-semibold">{item.keyword}:</span> {item.text.substring(item.keyword.length + 2)}
                    </li>
                ))}
            </ul>
        </div>
    );
};


const MedicationCard: React.FC<MedicationCardProps> = ({ analysis, onSelect, onViewDetails }) => {
  const { medication, dangers, warnings, successes, infos } = analysis;

  // Determinar el estilo de la tarjeta según el estado clínico
  let cardStyleClass = "bg-white border-slate-200"; // Default (Gris/Neutro)
  let headerClass = "bg-slate-50 border-slate-200 text-slate-700";
  
  if (dangers.length > 0) {
      // Rojo tenue si está contraindicado
      cardStyleClass = "bg-red-50 border-red-200 shadow-red-100";
      headerClass = "bg-red-100 border-red-200 text-red-900";
  } else if (warnings.length > 0 && successes.length > 0) {
      // Amarillo tenue si hay precauciones pero está indicado
      cardStyleClass = "bg-amber-50 border-amber-200 shadow-amber-100";
      headerClass = "bg-amber-100 border-amber-200 text-amber-900";
  } else if (successes.length > 0) {
      // Verde si está indicado y sin alertas mayores
      cardStyleClass = "bg-green-50 border-green-200 shadow-green-100";
      headerClass = "bg-green-100 border-green-200 text-green-900";
  } else {
       // Gris si no está explícitamente indicado
       cardStyleClass = "bg-slate-50 border-slate-200 opacity-90";
       headerClass = "bg-slate-100 border-slate-200 text-slate-600";
  }


  return (
    <div className={`rounded-xl shadow-md border flex flex-col transition-all hover:shadow-lg ${cardStyleClass}`}>
        <div className={`p-4 border-b rounded-t-xl flex justify-between items-center ${headerClass}`}>
            <h3 className="text-lg font-bold">{medication}</h3>
            {dangers.length > 0 && <span className="text-xs font-bold px-2 py-1 bg-red-200 text-red-800 rounded-full">NO RECOMENDADO</span>}
            {dangers.length === 0 && successes.length > 0 && <span className="text-xs font-bold px-2 py-1 bg-green-200 text-green-800 rounded-full">RECOMENDADO</span>}
        </div>
        
        <div className="p-5 space-y-4 flex-grow">
            <AnalysisSection level="danger" items={dangers} />
            <AnalysisSection level="warning" items={warnings} />
            <AnalysisSection level="success" items={successes} />
            <AnalysisSection level="info" items={infos} />
            
            {dangers.length === 0 && successes.length === 0 && warnings.length === 0 && infos.length === 0 && (
                <p className="text-sm text-slate-500 italic text-center py-4">No hay recomendaciones específicas para este perfil.</p>
            )}
        </div>
        
        <div className="p-4 border-t border-black/5 bg-white/50 rounded-b-xl space-y-2">
             <button
                onClick={onSelect}
                className={`w-full px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    dangers.length > 0 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-500'
                }`}
                disabled={dangers.length > 0}
                aria-label={dangers.length > 0 ? `No se puede seleccionar ${medication} debido a contraindicaciones` : `Seleccionar ${medication} y generar plan de acción`}
            >
                {dangers.length > 0 ? 'Contraindicado' : 'Seleccionar este Plan'}
            </button>
            <button
                onClick={onViewDetails}
                className="w-full px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Ver Detalles Farmacológicos
            </button>
        </div>
    </div>
  );
};

export default MedicationCard;
