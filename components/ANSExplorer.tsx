

import React, { useState } from 'react';
import { Medication } from '../types';

const medications = [Medication.Amitriptyline, Medication.Duloxetine, Medication.Gabapentin];
type Target = 'NA_CHANNEL' | 'CA_CHANNEL' | 'REUPTAKE';
type ViewMode = 'physiology' | 'pharmacology';

const TARGET_INFO: Record<Target, { name: string; description: string }> = {
    'NA_CHANNEL': { name: 'Canales de Sodio (Na+)', description: 'En la neurona periférica, los canales de sodio son cruciales para la generación y propagación de señales de dolor (potenciales de acción). Su bloqueo reduce la hiperexcitabilidad.' },
    'CA_CHANNEL': { name: 'Canales de Calcio (α2δ)', description: 'En la médula espinal (asta dorsal), estos canales regulan la liberación de neurotransmisores del dolor como el glutamato y la sustancia P. Es el sitio de acción de los gabapentinoides.' },
    'REUPTAKE': { name: 'Recaptación de 5-HT/NE', description: 'En el cerebro, las vías descendentes usan serotonina (5-HT) y noradrenalina (NE) para inhibir las señales de dolor en la médula espinal. Bloquear su recaptación potencia este efecto analgésico.' }
};

const PainPathwayExplorer: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('physiology');
    const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
    const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);

    const getTargetStyle = (target: Target) => {
        let style = { fill: '#dbeafe', stroke: '#3b82f6', blocked: false }; // Default blue

        if (viewMode === 'pharmacology' && selectedMed) {
            if ((selectedMed === Medication.Amitriptyline || selectedMed === Medication.Duloxetine) && target === 'REUPTAKE') {
                style = { fill: '#fecaca', stroke: '#ef4444', blocked: true };
            }
            if (selectedMed === Medication.Gabapentin && target === 'CA_CHANNEL') {
                style = { fill: '#fecaca', stroke: '#ef4444', blocked: true };
            }
            if (selectedMed === Medication.Amitriptyline && target === 'NA_CHANNEL') { // Amitriptyline also blocks Na+ channels
                 style = { fill: '#fecaca', stroke: '#ef4444', blocked: true };
            }
        }
        else if (viewMode === 'physiology') {
             if (selectedTarget === target) {
                style.fill = '#c4b5fd'; 
                style.stroke = '#8b5cf6';
             }
        }
        return style;
    };
    
    const getExplanation = () => {
        if (viewMode === 'pharmacology') {
            if (!selectedMed) return { title: 'Mecanismo de Acción Farmacológico', text: 'Seleccione un fármaco para ver su principal sitio de acción en la vía del dolor.' };
            switch (selectedMed) {
                case Medication.Amitriptyline: return { title: `Mecanismo de ${selectedMed}`, text: "Actúa centralmente bloqueando la recaptación de 5-HT/NE (potencia la inhibición) y también periféricamente bloqueando canales de sodio (reduce la excitabilidad)." };
                case Medication.Duloxetine: return { title: `Mecanismo de ${selectedMed}`, text: "Actúa principalmente a nivel central, bloqueando la recaptación de 5-HT y NE para fortalecer las vías descendentes que suprimen el dolor." };
                case Medication.Gabapentin: return { title: `Mecanismo de ${selectedMed}`, text: "Actúa en la médula espinal uniéndose a la subunidad α2δ de los canales de calcio, lo que disminuye la liberación de neurotransmisores pro-dolor." };
                default: return { title: 'Mecanismo de Acción', text: '' };
            }
        } else { // Physiology mode
            if (!selectedTarget) return { title: 'Fisiología de la Vía del Dolor', text: 'Una señal de dolor viaja desde la periferia, es procesada en la médula espinal y llega al cerebro. Las vías descendentes del cerebro pueden modular esta señal. Seleccione un objetivo para saber más.' };
            return { title: `Rol de ${TARGET_INFO[selectedTarget].name}`, text: TARGET_INFO[selectedTarget].description };
        }
    }

    const { title: explanationTitle, text: explanationText } = getExplanation();

    const renderBlockedMark = (blocked: boolean | undefined) => {
        if (!blocked) return null;
        return (
             <g>
                <line x1="-8" y1="-8" x2="8" y2="8" stroke="#dc2626" strokeWidth="2.5" />
                <line x1="-8" y1="8" x2="8" y2="-8" stroke="#dc2626" strokeWidth="2.5" />
            </g>
        )
    };
    
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 max-w-5xl mx-auto">
            <div className="border-b pb-4 mb-6">
                 <h2 className="text-xl font-semibold text-slate-900">Explorador de Vías del Dolor</h2>
                 <p className="text-sm text-slate-500 mt-1">Visualización interactiva de la neurotransmisión y la farmacología del dolor neuropático.</p>
            </div>
            
            <div className="flex justify-center mb-6">
                <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                    {(['physiology', 'pharmacology'] as ViewMode[]).map(mode => (
                        <button
                            key={mode}
                            onClick={() => {
                                setViewMode(mode);
                                if (mode === 'physiology') setSelectedMed(null);
                                else setSelectedTarget(null);
                            }}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                viewMode === mode 
                                ? 'bg-white text-indigo-600 shadow-sm' 
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            {mode === 'physiology' ? 'Fisiología Normal' : 'Acción Farmacológica'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <svg viewBox="0 0 400 300" className="w-full h-auto bg-slate-50 rounded-lg border">
                        {/* Labels */}
                        <text x="50" y="285" textAnchor="middle" fontSize="10" fill="#475569">Periferia</text>
                        <text x="200" y="285" textAnchor="middle" fontSize="10" fill="#475569">Médula Espinal</text>
                        <text x="350" y="285" textAnchor="middle" fontSize="10" fill="#475569">Cerebro</text>
                        <rect x="1" y="270" width="100" height="2" fill="#f59e0b" />
                        <rect x="150" y="270" width="100" height="2" fill="#8b5cf6" />
                        <rect x="300" y="270" width="100" height="2" fill="#0ea5e9" />

                        {/* Ascending Pathway */}
                        <text x="125" y="140" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">Vía Ascendente del Dolor</text>
                        <path d="M 50 260 C 100 150, 150 150, 200 150" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" fill="none" />
                        <path d="M 200 150 C 250 150, 300 150, 350 50" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" fill="none" />
                        <polygon points="350,45 355,55 345,55" fill="#ef4444"/>

                        {/* Descending Pathway */}
                        <text x="300" y="180" textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="bold">Vía Descendente Inhibitoria</text>
                        <path d="M 350 80 C 300 180, 250 180, 200 180" stroke="#22c55e" strokeWidth="2" fill="none" />
                        <polygon points="200,185 195,175 205,175" fill="#22c55e"/>

                        {/* Targets */}
                        <g transform="translate(50, 200)">
                            {/* FIX: The && operator cannot be used on a void return type. Replaced with a function block to sequence the state updates. */}
                            <circle r="15" {...getTargetStyle('NA_CHANNEL')} onClick={() => { setViewMode('physiology'); setSelectedTarget('NA_CHANNEL'); }}/>
                            <text x="0" y="5" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Na+</text>
                            {renderBlockedMark(getTargetStyle('NA_CHANNEL').blocked)}
                        </g>
                         <g transform="translate(200, 165)">
                            {/* FIX: The && operator cannot be used on a void return type. Replaced with a function block to sequence the state updates. */}
                            <circle r="15" {...getTargetStyle('CA_CHANNEL')} onClick={() => { setViewMode('physiology'); setSelectedTarget('CA_CHANNEL'); }}/>
                            <text x="0" y="5" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Ca+</text>
                            {renderBlockedMark(getTargetStyle('CA_CHANNEL').blocked)}
                        </g>
                         <g transform="translate(250, 100)">
                            {/* FIX: The && operator cannot be used on a void return type. Replaced with a function block to sequence the state updates. */}
                            <circle r="15" {...getTargetStyle('REUPTAKE')} onClick={() => { setViewMode('physiology'); setSelectedTarget('REUPTAKE'); }}/>
                             <text x="0" y="5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1e293b">5HT/NE</text>
                            {renderBlockedMark(getTargetStyle('REUPTAKE').blocked)}
                        </g>
                    </svg>
                </div>
                <div className="space-y-4">
                    {viewMode === 'pharmacology' ? (
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2">Seleccionar Fármaco:</h3>
                            <div className="space-y-2">
                                {medications.map(med => (
                                    <button key={med} onClick={() => setSelectedMed(med)}
                                        className={`w-full text-left p-3 border rounded-lg transition-all text-sm ${selectedMed === med ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500' : 'border-slate-300 hover:border-indigo-400'}`}>
                                        {med}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                         <div>
                            <h3 className="font-semibold text-slate-800 mb-2">Explorar Dianas Moleculares:</h3>
                            <div className="space-y-2">
                                {(Object.keys(TARGET_INFO) as Target[]).map(target => (
                                    <button key={target} onClick={() => setSelectedTarget(target)}
                                        className={`w-full text-left p-3 border rounded-lg transition-all text-sm font-medium ${selectedTarget === target ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500' : 'border-slate-300 hover:border-indigo-400'}`}>
                                        {TARGET_INFO[target].name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg min-h-[120px]">
                        <p className="text-sm font-semibold text-indigo-800 mb-1">{explanationTitle}</p>
                        <p className="text-sm text-indigo-900">{explanationText}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PainPathwayExplorer;