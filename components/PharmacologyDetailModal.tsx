import Markdown from './MarkdownText';
import React, { useState } from 'react';
import { Medication, PharmacologyData } from '../types';

interface PharmacologyDetailModalProps {
  isOpen: boolean;
  medication: Medication;
  pharmacologyData: PharmacologyData;
  onClose: () => void;
}

type Tab = 'pk_pd' | 'posology' | 'interactions' | 'monitoring';

const TAB_OPTIONS: { id: Tab; label: string }[] = [
    { id: 'pk_pd', label: 'PK/PD' },
    { id: 'posology', label: 'Posología' },
    { id: 'interactions', label: 'Interacciones' },
    { id: 'monitoring', label: 'Monitorización' }
];



const PharmacologyDetailModal: React.FC<PharmacologyDetailModalProps> = ({ isOpen, medication, pharmacologyData, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('pk_pd');

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 transition-opacity"
        aria-labelledby="pharma-modal-title"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200">
            <h2 id="pharma-modal-title" className="text-xl font-bold text-blue-900">Guía Farmacológica: <span className="text-blue-800">{medication}</span></h2>
            <p className="text-sm text-slate-600 mt-1">Monografía detallada del medicamento.</p>
        </div>
        
        <div className="border-b border-slate-200 px-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {TAB_OPTIONS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                                ? 'border-blue-800 text-blue-800'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>

        <div className="p-6 flex-grow overflow-y-auto min-h-[300px]">
            <article>
              <Markdown text={pharmacologyData[activeTab]} />
            </article>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-end">
            <button
                type="button"
                className="px-4 py-2 bg-blue-800 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={onClose}
            >
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacologyDetailModal;