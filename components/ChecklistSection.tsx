
import React from 'react';
import { ChecklistItemData, ChecklistLevel, Diagnosis, Medication } from '../types';
import { InfoIcon } from './icons/InfoIcon';
import { BarsArrowUpIcon } from './icons/BarsArrowUpIcon';

interface ChecklistSectionProps {
  items: ChecklistItemData[];
  checkedItems: Record<string, boolean>;
  onToggleItem: (itemId: string) => void;
  onGetInfo: (itemText: string) => void;
  onBackToDashboard: () => void;
  onViewTitration?: (drug: 'gabapentin' | 'pregabalin') => void;
  scenario: { diagnosis: Diagnosis; medication: string };
}

const getPillStyle = (level: ChecklistLevel): string => {
  switch (level) {
    case 'danger': return 'bg-red-100 text-red-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'success': return 'bg-green-100 text-green-800';
    case 'info': return 'bg-sky-100 text-sky-800';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const ChecklistItem: React.FC<{
  item: ChecklistItemData;
  isChecked: boolean;
  onToggle: () => void;
  onGetInfo: () => void;
}> = ({ item, isChecked, onToggle, onGetInfo }) => {
    const pillStyle = getPillStyle(item.level);

    return (
        <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all">
            <input 
                type="checkbox"
                className="h-5 w-5 rounded border-slate-300 text-blue-800 focus:ring-blue-500 cursor-pointer mt-0.5 flex-shrink-0" 
                checked={isChecked} 
                onChange={onToggle}
                aria-labelledby={`item-text-${item.id}`}
            />
            <div className="flex-1">
                <span id={`item-text-${item.id}`} className={`transition-colors ${isChecked ? "line-through text-slate-400" : "text-slate-800"}`}>
                    <span className={`inline-block mr-2 px-2 py-0.5 text-xs font-semibold rounded-full ${pillStyle}`}>
                        {item.keyword}
                    </span>
                    {item.text.substring(item.keyword.length + 2)}
                </span>
            </div>
            <button 
                onClick={onGetInfo}
                className="p-1 rounded-full text-slate-400 hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex-shrink-0"
                aria-label={`Obtener más información sobre: ${item.text}`}
            >
                <InfoIcon className="w-5 h-5" />
            </button>
        </li>
    );
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({ items, checkedItems, onToggleItem, onGetInfo, onBackToDashboard, onViewTitration, scenario }) => {
  
  const isGabapentinoid = scenario.medication === Medication.Gabapentin || scenario.medication === Medication.Pregabalin;
  
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b pb-4 gap-4">
        <div>
            <h2 className="text-lg font-semibold text-blue-900">Plan de Acción para <span className="text-blue-800">{scenario.medication}</span></h2>
            <p className="text-sm text-slate-500">Basado en evidencia (Guías AAN/EULAR/NeuPSIG)</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {isGabapentinoid && onViewTitration && (
                <button
                    onClick={() => onViewTitration(scenario.medication === Medication.Gabapentin ? 'gabapentin' : 'pregabalin')}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors flex-1 sm:flex-initial"
                >
                    <BarsArrowUpIcon className="w-4 h-4" />
                    Ver Pauta Titulación
                </button>
            )}
            <button 
            onClick={onBackToDashboard}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 flex-1 sm:flex-initial"
            >
            &larr; Volver
            </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-500">No se generaron recomendaciones para este plan.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <ChecklistItem 
                key={item.id}
                item={item}
                isChecked={!!checkedItems[item.id]}
                onToggle={() => onToggleItem(item.id)}
                onGetInfo={() => onGetInfo(item.text)}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default ChecklistSection;
