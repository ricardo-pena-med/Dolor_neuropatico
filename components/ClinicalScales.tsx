
import React, { useState } from 'react';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

type Scale = 'NRS' | 'DN4' | 'BPI' | null;

// DN4: Separado en Interrogatorio (Sintomas) y Examen (Signos) para flujo clínico real
const DN4_QUESTIONS = [
    { id: 'q1', text: 'Quemazón (Ardor)', type: 'boolean', category: 'INTERROGATORIO' },
    { id: 'q2', text: 'Sensación de frío doloroso', type: 'boolean', category: 'INTERROGATORIO' },
    { id: 'q3', text: 'Descargas eléctricas', type: 'boolean', category: 'INTERROGATORIO' },
    { id: 'q4', text: 'Hormigueo', type: 'boolean', category: 'INTERROGATORIO' },
    { id: 'q5', text: 'Pinchazos', type: 'boolean', category: 'INTERROGATORIO' },
    { id: 'q6', text: 'Entumecimiento', type: 'boolean', category: 'INTERROGATORIO' },
    { id: 'q7', text: 'Picor (Prurito)', type: 'boolean', category: 'INTERROGATORIO' },
    { id: 'q8', text: 'Hipoestesia al tacto', type: 'boolean', category: 'EXAMEN' },
    { id: 'q9', text: 'Hipoestesia al pinchazo', type: 'boolean', category: 'EXAMEN' },
    { id: 'q10', text: 'Alodinia (dolor al roce)', type: 'boolean', category: 'EXAMEN' },
];

const BPI_QUESTIONS = [
    'Actividad general',
    'Estado de ánimo',
    'Capacidad para caminar',
    'Trabajo normal',
    'Relaciones con otras personas',
    'Sueño',
    'Disfrute de la vida',
];

const ClinicalScales: React.FC = () => {
    const [activeScale, setActiveScale] = useState<Scale>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [score, setScore] = useState<number | { pain: number, interference: number } | null>(null);

    const handleSelectScale = (scale: Scale) => {
        setActiveScale(scale);
        setAnswers({});
        setScore(null);
    };
    
    const handleAnswerChange = (id: string, value: any) => {
        setAnswers(prev => ({...prev, [id]: value}));
        setScore(null); // Reset score when an answer changes
    };
    
    const calculateScore = () => {
        if (!activeScale) return;
        
        if (activeScale === 'DN4') {
            const newScore = Object.values(answers).filter(v => v === true).length;
            setScore(newScore);
        } else if (activeScale === 'NRS') {
            const newScore = answers['nrs'] || 0;
            setScore(newScore);
        } else if (activeScale === 'BPI') {
            const painScore = answers['bpi-pain'] || 0;
            const interferenceScores = BPI_QUESTIONS.map((q, i) => answers[`bpi-q${i}`] || 0);
            const totalInterference = interferenceScores.reduce((a, b) => a + b, 0);
            const averageInterference = totalInterference / BPI_QUESTIONS.length;
            setScore({ pain: painScore, interference: parseFloat(averageInterference.toFixed(1)) }); 
        }
    };

    const renderDN4 = () => {
        const interrogatorio = DN4_QUESTIONS.filter(q => q.category === 'INTERROGATORIO');
        const examen = DN4_QUESTIONS.filter(q => q.category === 'EXAMEN');

        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3 border-b pb-1">1. Interrogatorio (Síntomas)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {interrogatorio.map(q => (
                             <label key={q.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${answers[q.id] ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                <input type="checkbox" checked={!!answers[q.id]} onChange={(e) => handleAnswerChange(q.id, e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-blue-800 focus:ring-blue-500" />
                                <span className="text-sm font-medium text-slate-700">{q.text}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3 border-b pb-1">2. Examen Físico (Signos)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                         {examen.map(q => (
                             <label key={q.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${answers[q.id] ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                <input type="checkbox" checked={!!answers[q.id]} onChange={(e) => handleAnswerChange(q.id, e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-blue-800 focus:ring-blue-500" />
                                <span className="text-sm font-medium text-slate-700">{q.text}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderScale = () => {
        switch(activeScale) {
            case 'NRS':
                return (
                    <div className="py-4">
                        <label htmlFor="nrs-slider" className="block text-base font-medium text-slate-700 mb-4 text-center">
                            Intensidad del Dolor (0-10)
                        </label>
                        <div className="flex items-center gap-6 max-w-lg mx-auto">
                            <span className="text-sm text-slate-500">Sin Dolor</span>
                            <input 
                                id="nrs-slider" 
                                type="range" 
                                min="0" 
                                max="10" 
                                value={answers['nrs'] || 0} 
                                onChange={(e) => handleAnswerChange('nrs', parseInt(e.target.value))} 
                                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-800"
                            />
                            <span className="text-sm text-slate-500">Peor Imaginable</span>
                        </div>
                        <div className="text-center mt-4">
                             <span className="font-extrabold text-blue-900 text-4xl">{answers['nrs'] || 0}</span>
                        </div>
                    </div>
                );
            case 'DN4':
                return renderDN4();
            case 'BPI':
                return (
                    <div className="space-y-8">
                         <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <label htmlFor="bpi-pain" className="block text-sm font-bold text-blue-900 mb-2">Intensidad del Dolor (Promedio 24h)</label>
                            <div className="flex items-center gap-4">
                               <input id="bpi-pain" type="range" min="0" max="10" value={answers['bpi-pain'] || 0} onChange={(e) => handleAnswerChange('bpi-pain', parseInt(e.target.value))} className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-800"/>
                               <span className="font-bold text-blue-800 text-xl w-10 text-center">{answers['bpi-pain'] || 0}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Interferencia en la vida diaria (0 = Nada, 10 = Totalmente)</h3>
                             <div className="space-y-5">
                                {BPI_QUESTIONS.map((q, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>{q}</span>
                                            <span className="font-semibold text-blue-700">{answers[`bpi-q${i}`] || 0}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="10" 
                                            value={answers[`bpi-q${i}`] || 0} 
                                            onChange={(e) => handleAnswerChange(`bpi-q${i}`, parseInt(e.target.value))} 
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500 hover:accent-blue-600"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default:
                return <p className="text-center text-slate-500 py-10">Seleccione una escala arriba para comenzar la evaluación.</p>;
        }
    };
    
    const renderInterpretation = () => {
        if (score === null) return null;
        
        if (activeScale === 'NRS' && typeof score === 'number') {
            let color = 'bg-green-100 text-green-800 border-green-200';
            let text = "Dolor Leve";
            let advice = "Revaluar si persiste. Tratamiento escalonado según necesidad.";
            
            if (score === 0) {
                text = "Sin dolor";
                advice = "No refiere dolor en esta evaluación.";
            } else if (score >= 4 && score <= 6) {
                color = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                text = "Dolor Moderado";
                advice = "Considerar ajuste de dosis o terapia combinada. Impacto en funcionalidad probable.";
            } else if (score >= 7) {
                color = 'bg-red-100 text-red-800 border-red-200';
                text = "Dolor Severo";
                advice = "Atención prioritaria. Evaluar interferencia severa en sueño y ánimo. Optimizar tratamiento.";
            }

            return (
                <div className={`p-4 rounded-lg border-l-4 ${color} mt-6 animate-fade-in`}>
                    <div className="flex items-start gap-3">
                        <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-lg">{text}</p>
                            <p className="text-sm mt-1 opacity-90">{advice}</p>
                        </div>
                    </div>
                </div>
            );
        }
        
        if (activeScale === 'DN4' && typeof score === 'number') {
            const isNeuropathic = score >= 4;
            return (
                <div className={`p-4 rounded-lg border-l-4 mt-6 animate-fade-in ${isNeuropathic ? 'bg-red-50 border-red-500 text-red-900' : 'bg-green-50 border-green-500 text-green-900'}`}>
                    <div className="flex items-start gap-3">
                         {isNeuropathic ? <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0" /> : <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />}
                        <div>
                            <p className="font-bold text-lg">Puntuación: {score}/10</p>
                            <p className="font-semibold">{isNeuropathic ? 'Alta Probabilidad de Dolor Neuropático' : 'Baja Probabilidad de Dolor Neuropático'}</p>
                            <p className="text-sm mt-2 opacity-90">
                                {isNeuropathic 
                                    ? 'Sensibilidad 83%, Especificidad 90% (Bouhassira et al., 2005). Se recomienda iniciar algoritmo de tratamiento para dolor neuropático.' 
                                    : 'Considere otras etiologías (nociceptivo, nociplástico) o revalúe si la clínica es muy sugerente.'}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeScale === 'BPI' && typeof score === 'object') {
            const { pain, interference } = score;
            return (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                        <p className="text-xs uppercase tracking-wide text-blue-600 font-bold">Severidad del Dolor</p>
                        <p className="text-3xl font-extrabold text-blue-900 mt-1">{pain}<span className="text-sm text-blue-400 font-normal">/10</span></p>
                    </div>
                    <div className={`p-4 rounded-lg border text-center ${interference > 5 ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}>
                        <p className={`text-xs uppercase tracking-wide font-bold ${interference > 5 ? 'text-orange-700' : 'text-slate-600'}`}>Interferencia Funcional</p>
                        <p className={`text-3xl font-extrabold mt-1 ${interference > 5 ? 'text-orange-800' : 'text-slate-800'}`}>{interference}<span className="text-sm opacity-60 font-normal">/10</span></p>
                        {interference > 5 && <p className="text-xs text-orange-700 mt-1 font-medium">⚠️ Impacto significativo en calidad de vida</p>}
                    </div>
                </div>
            )
        }

        return null;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-blue-900 sm:text-3xl">Escalas Clínicas de Evaluación</h2>
                <p className="mt-2 text-lg text-slate-600">Herramientas validadas para apoyar el diagnóstico y seguimiento.</p>
            </div>
            
            <div className="flex justify-center gap-3 flex-wrap">
                <button onClick={() => handleSelectScale('NRS')} className={`px-5 py-2.5 text-sm font-medium rounded-full shadow-sm transition-all ${activeScale === 'NRS' ? 'bg-blue-800 text-white ring-2 ring-offset-2 ring-blue-800' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}>
                    Escala Visual (NRS)
                </button>
                <button onClick={() => handleSelectScale('DN4')} className={`px-5 py-2.5 text-sm font-medium rounded-full shadow-sm transition-all ${activeScale === 'DN4' ? 'bg-blue-800 text-white ring-2 ring-offset-2 ring-blue-800' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}>
                    Cuestionario DN4
                </button>
                <button onClick={() => handleSelectScale('BPI')} className={`px-5 py-2.5 text-sm font-medium rounded-full shadow-sm transition-all ${activeScale === 'BPI' ? 'bg-blue-800 text-white ring-2 ring-offset-2 ring-blue-800' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}>
                    Inventario Breve (BPI)
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 md:p-8 min-h-[400px] flex flex-col">
                <div className="flex-grow">
                    {renderScale()}
                </div>
                
                {activeScale && (
                     <div className="mt-8 pt-6 border-t border-slate-100">
                         <button 
                            onClick={calculateScore} 
                            className="w-full py-3 bg-blue-800 text-white text-base font-medium rounded-lg shadow-md hover:bg-blue-900 disabled:bg-slate-300 transition-all transform active:scale-[0.99]"
                         >
                            Calcular e Interpretar Resultados
                        </button>
                        {renderInterpretation()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClinicalScales;
