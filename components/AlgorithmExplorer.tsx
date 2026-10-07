import React, { useState, useCallback, useMemo } from 'react';
import { Algorithm, AlgorithmStep } from '../types';
import { TREATMENT_ALGORITHM } from '../data/algorithm';
import { ArrowUturnLeftIcon } from './icons/ArrowUturnLeftIcon';

const AlgorithmExplorer: React.FC = () => {
    const [algorithm, setAlgorithm] = useState<Algorithm | null>(TREATMENT_ALGORITHM);
    const [currentStepId, setCurrentStepId] = useState<string | null>(TREATMENT_ALGORITHM.startStepId);
    
    const handleReset = useCallback(() => {
        setCurrentStepId(TREATMENT_ALGORITHM.startStepId);
    }, []);

    const handleOptionClick = (nextStepId: string) => {
        if (algorithm?.steps.find(s => s.id === nextStepId)) {
            setCurrentStepId(nextStepId);
        } else {
            console.warn(`Step with id "${nextStepId}" not found!`);
        }
    };

    const currentStep = useMemo(() => {
        return algorithm?.steps.find(step => step.id === currentStepId);
    }, [algorithm, currentStepId]);

    if (!algorithm || !currentStep) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 max-w-2xl mx-auto p-8 text-center">
                <h2 className="text-xl font-semibold text-red-700">Error</h2>
                <p className="text-slate-600 mt-2">No se pudo cargar el algoritmo de tratamiento. Por favor, recargue la aplicación.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 max-w-3xl mx-auto">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-blue-900 truncate" title={algorithm.title}>
                    {algorithm.title}
                </h2>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-300 rounded-md shadow-sm hover:bg-slate-200"
                    title="Reiniciar algoritmo"
                >
                    <ArrowUturnLeftIcon className="w-4 h-4"/>
                    <span className="hidden sm:inline">Reiniciar</span>
                </button>
            </div>
            <div className="p-6 md:p-8 min-h-[300px]">
                <div className={`p-4 rounded-lg mb-6 ${currentStep.type === 'decision' ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-slate-50 border-l-4 border-slate-500'}`}>
                    <h3 className="text-lg font-bold text-slate-900">{currentStep.title}</h3>
                    <p className="text-slate-700 mt-2 text-base leading-relaxed">{currentStep.text}</p>
                </div>
                
                <div className="space-y-3">
                    {currentStep.type === 'decision' && currentStep.options?.map((option, index) => (
                        <button key={index} onClick={() => handleOptionClick(option.nextStepId)}
                            className="w-full text-left p-4 bg-white rounded-lg shadow-sm border border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                           &rarr; {option.text}
                        </button>
                    ))}
                    {(currentStep.type === 'action' || currentStep.type === 'start') && currentStep.nextStepId && (
                        <button onClick={() => handleOptionClick(currentStep.nextStepId!)}
                            className="w-full px-4 py-2.5 bg-blue-800 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Siguiente Paso
                        </button>
                    )}
                    {currentStep.type === 'end' && (
                        <div className="text-center p-4 bg-green-50 text-green-800 rounded-lg">
                            <p className="font-semibold">{currentStep.title}</p>
                             <p className="text-sm mt-1">{currentStep.text}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlgorithmExplorer;