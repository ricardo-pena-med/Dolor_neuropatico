import React from 'react';
import { MedicationAnalysis, Medication } from '../types';
import MedicationCard from './MedicationCard';

interface AnalysisDashboardProps {
  analysis: MedicationAnalysis[];
  onSelectMedication: (medication: Medication) => void;
  onViewDetails: (medication: Medication) => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis, onSelectMedication, onViewDetails }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-blue-900">Dashboard de Análisis Clínico</h2>
        <p className="text-slate-500 mt-1">Compare las opciones de tratamiento basadas en el perfil del paciente.</p>
      </div>
      {analysis.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {analysis.map(medAnalysis => (
            <MedicationCard 
              key={medAnalysis.medication}
              analysis={medAnalysis}
              onSelect={() => onSelectMedication(medAnalysis.medication)}
              onViewDetails={() => onViewDetails(medAnalysis.medication)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800">Sin Opciones de Tratamiento</h3>
            <p className="text-sm text-slate-500 mt-2">No hay medicamentos en esta demo que coincidan con el diagnóstico seleccionado.</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;