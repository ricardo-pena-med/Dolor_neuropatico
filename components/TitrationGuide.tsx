
import React, { useState, useEffect } from 'react';
import { Medication } from '../types';

type Drug = 'gabapentin' | 'pregabalin';

const GABAPENTIN_SCHEDULE = [
    { day: "Día 1-3", dose: "300 mg por la noche", notes: "Evaluar somnolencia matutina." },
    { day: "Día 4-6", dose: "300 mg dos veces al día", notes: "Añadir dosis por la mañana." },
    { day: "Día 7+", dose: "300 mg tres veces al día (Total: 900 mg)", notes: "Dosis inicial terapéutica." },
    { day: "Semana 2-4", dose: "Aumentar 300 mg cada 3-7 días", notes: "Titular según respuesta y tolerancia." },
    { day: "Dosis Objetivo", dose: "1800 - 3600 mg/día", notes: "Dividido en 3 tomas. La dosis máxima rara vez es necesaria (NeuPSIG 2015)." }
];

const PREGABALIN_SCHEDULE = [
    { day: "Día 1-7", dose: "75 mg dos veces al día (Total: 150 mg)", notes: "Dosis de inicio estándar." },
    { day: "Semana 2", dose: "Aumentar a 150 mg dos veces al día (Total: 300 mg)", notes: "Si la dosis inicial es bien tolerada y se necesita más eficacia." },
    { day: "Semana 3-4", dose: "Aumentar hasta 300 mg dos veces al día (Total: 600 mg)", notes: "Dosis máxima. Evaluar cuidadosamente el balance eficacia/tolerabilidad." },
    { day: "Dosis Objetivo", dose: "300 - 600 mg/día", notes: "Dividido en 2 tomas (Mathieson et al., BMJ 2020)." }
];

interface TitrationGuideProps {
    initialDrug?: Drug;
}

const TitrationGuide: React.FC<TitrationGuideProps> = ({ initialDrug = 'pregabalin' }) => {
    const [selectedDrug, setSelectedDrug] = useState<Drug>(initialDrug);

    useEffect(() => {
        if (initialDrug) setSelectedDrug(initialDrug);
    }, [initialDrug]);

    const schedule = selectedDrug === 'gabapentin' ? GABAPENTIN_SCHEDULE : PREGABALIN_SCHEDULE;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-blue-900 sm:text-3xl">Guía de Titulación de Gabapentinoides</h2>
                <p className="mt-2 text-lg text-slate-600">Pautas prácticas para un ajuste de dosis seguro y eficaz.</p>
            </div>

            <div className="flex justify-center">
                <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                        onClick={() => setSelectedDrug('pregabalin')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedDrug === 'pregabalin' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Pregabalina
                    </button>
                    <button
                        onClick={() => setSelectedDrug('gabapentin')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedDrug === 'gabapentin' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Gabapentina
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Esquema de Titulación para {selectedDrug === 'pregabalin' ? 'Pregabalina' : 'Gabapentina'}</h3>
                <div className="flow-root">
                    <ul className="-mb-8">
                        {schedule.map((item, index) => (
                            <li key={index}>
                                <div className="relative pb-8">
                                    {index !== schedule.length - 1 && (
                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                                    )}
                                    <div className="relative flex space-x-3 items-start">
                                        <div>
                                            <span className={`h-8 w-8 rounded-full ${index === schedule.length - 1 ? 'bg-red-700' : 'bg-blue-800'} flex items-center justify-center ring-8 ring-white`}>
                                                <span className="text-white font-bold text-sm">{index + 1}</span>
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1.5">
                                            <p className="text-sm font-semibold text-slate-800">{item.day}: <span className={`font-bold ${index === schedule.length - 1 ? 'text-red-700' : 'text-blue-800'}`}>{item.dose}</span></p>
                                            <p className="mt-1 text-sm text-slate-500">{item.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                <p className="font-semibold text-yellow-800">Consideraciones Clave (AAN 2022)</p>
                <ul className="list-disc list-inside text-sm text-yellow-900 mt-2 space-y-1">
                    <li>**Ajuste por función renal:** Ambas drogas requieren un ajuste de dosis significativo si el aclaramiento de creatinina es &lt;60 mL/min. ¡Verificar siempre!</li>
                    <li>**Población anciana:** Iniciar con las dosis más bajas posibles y titular mucho más lentamente.</li>
                    <li>**Objetivo:** El objetivo es encontrar el balance óptimo entre la máxima eficacia y los mínimos efectos adversos. No todos los pacientes requieren la dosis máxima.</li>
                    <li>**Educación del paciente:** Advertir sobre somnolencia y mareos, y aconsejar precaución al conducir o realizar tareas que requieran alerta.</li>
                </ul>
            </div>
        </div>
    );
};

export default TitrationGuide;
