import React from 'react';
import { PatientProfile, Diagnosis, ConcomitantDrug } from '../types';
import { DIAGNOSIS_OPTIONS, CONCOMITANT_DRUGS_OPTIONS } from '../constants';

interface PatientProfileFormProps {
  profile: PatientProfile;
  onChange: (profile: PatientProfile) => void;
  onSubmit: (profile: PatientProfile) => void;
}

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-100 transition-colors">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-800 focus:ring-blue-500" />
        <span className="text-sm text-slate-800">{label}</span>
    </label>
);

const MultiSelectCheckbox: React.FC<{
    option: { id: ConcomitantDrug; label: string };
    selected: boolean;
    onChange: (id: ConcomitantDrug, selected: boolean) => void;
}> = ({ option, selected, onChange }) => (
    <label className={`flex items-center gap-2 cursor-pointer p-3 border rounded-lg transition-all text-sm ${selected ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400'}`}>
        <input type="checkbox" checked={selected} onChange={e => onChange(option.id, e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-800 focus:ring-blue-500" />
        <span className={`font-medium ${selected ? 'text-blue-900' : 'text-slate-800'}`}>{option.label}</span>
    </label>
);

const PatientProfileForm: React.FC<PatientProfileFormProps> = ({ profile, onChange, onSubmit }) => {
  const handleChange = <K extends keyof PatientProfile>(field: K, value: PatientProfile[K]) => {
    onChange({ ...profile, [field]: value });
  };
  
  const handleDrugChange = (drugId: ConcomitantDrug, isSelected: boolean) => {
    const newDrugs = isSelected
        ? [...profile.concomitantDrugs, drugId]
        : profile.concomitantDrugs.filter(d => d !== drugId);
    onChange({ ...profile, concomitantDrugs: newDrugs });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold text-blue-900">Perfil del Paciente</h2>
        <p className="text-sm text-slate-500 mt-1">Ingrese los datos para analizar las opciones de tratamiento.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Diagnóstico Principal</label>
        <div className="grid sm:grid-cols-2 gap-2">
            {DIAGNOSIS_OPTIONS.map(opt => (
                <button key={opt.id} type="button" onClick={() => handleChange('diagnosis', opt.id)} className={`w-full text-left p-3 border rounded-lg transition-all text-sm ${profile.diagnosis === opt.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-slate-300 hover:border-blue-400'}`}>
                    <p className={`font-semibold ${profile.diagnosis === opt.id ? 'text-blue-900' : 'text-slate-800'}`}>{opt.name}</p>
                </button>
            ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <div>
            <label htmlFor="painScore" className="block text-sm font-medium text-slate-700 mb-1.5">Intensidad del Dolor (0-10)</label>
            <div className="flex items-center gap-4">
                <input id="painScore" type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-800" value={profile.painScore} onChange={(e) => handleChange('painScore', parseInt(e.target.value, 10))} min="0" max="10" />
                <span className="font-bold text-blue-800 text-lg w-10 text-center">{profile.painScore}</span>
            </div>
        </div>
        <div>
            <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1.5">Edad del Paciente</label>
            <div className="flex items-center gap-4">
                <input id="age" type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-800" value={profile.age} onChange={(e) => handleChange('age', parseInt(e.target.value, 10))} min="18" max="100" />
                <span className="font-bold text-blue-800 text-lg w-12 text-center">{profile.age}</span>
            </div>
        </div>
      </div>


      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">Comorbilidades y Riesgos Relevantes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            <Checkbox label="Insuficiencia Renal (ClCr < 60)" checked={profile.insuficienciaRenal} onChange={(c) => handleChange('insuficienciaRenal', c)} />
            <Checkbox label="Cardiopatía (isquémica, arritmias)" checked={profile.cardiopatia} onChange={(c) => handleChange('cardiopatia', c)} />
            <Checkbox label="Riesgo Suicida / Depresión Mayor" checked={profile.riesgoSuicida} onChange={(c) => handleChange('riesgoSuicida', c)} />
            <Checkbox label="Glaucoma de ángulo estrecho" checked={profile.glaucoma} onChange={(c) => handleChange('glaucoma', c)} />
            <Checkbox label="Estreñimiento crónico" checked={profile.estrenimiento} onChange={(c) => handleChange('estrenimiento', c)} />
            <Checkbox label="Hipotensión o riesgo de caídas" checked={profile.hypotensionRisk} onChange={(c) => handleChange('hypotensionRisk', c)} />
            <Checkbox label="Somnolencia diurna / Fatiga" checked={profile.somnolencia} onChange={(c) => handleChange('somnolencia', c)} />
        </div>
      </div>
      
       <div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">Fármacos Concomitantes (para Interacciones)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CONCOMITANT_DRUGS_OPTIONS.map(opt => (
                <MultiSelectCheckbox 
                    key={opt.id} 
                    option={opt}
                    selected={profile.concomitantDrugs.includes(opt.id)}
                    onChange={handleDrugChange}
                />
            ))}
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
        <button type="submit" className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-blue-800 border border-transparent rounded-md shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Analizar Escenario Clínico
        </button>
      </div>
    </form>
  );
};

export default PatientProfileForm;
