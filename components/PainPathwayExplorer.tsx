import React, { useState } from 'react';
import { Medication } from '../types';

const medications = [
    Medication.Gabapentin,
    Medication.Pregabalin,
    Medication.Amitriptyline,
    Medication.Duloxetine,
    Medication.Venlafaxine,
    Medication.Carbamazepine,
];

type Target = 'NA_CHANNEL' | 'CA_CHANNEL' | 'REUPTAKE';

const PainPathwayExplorer: React.FC = () => {
    const [selectedMed, setSelectedMed] = useState<Medication | null>(null);

    const getTargetState = (target: Target) => {
        let isBlocked = false;
        if (selectedMed) {
            if ((selectedMed === Medication.Gabapentin || selectedMed === Medication.Pregabalin) && target === 'CA_CHANNEL') {
                isBlocked = true;
            }
            if ((selectedMed === Medication.Amitriptyline || selectedMed === Medication.Duloxetine || selectedMed === Medication.Venlafaxine) && target === 'REUPTAKE') {
                isBlocked = true;
            }
            if ((selectedMed === Medication.Amitriptyline || selectedMed === Medication.Carbamazepine) && target === 'NA_CHANNEL') {
                isBlocked = true;
            }
        }
        return { isBlocked };
    };
    
    const caChannelBlocked = getTargetState('CA_CHANNEL').isBlocked;

    const getExplanation = () => {
        if (!selectedMed) return { title: 'Mecanismo de Acción Sináptico', text: 'Seleccione un fármaco para visualizar cómo modula la transmisión de la señal de dolor en la sinapsis del asta dorsal.' };
        switch (selectedMed) {
            case Medication.Amitriptyline: return { title: `Mecanismo de ${selectedMed}`, text: "Bloquea los transportadores de recaptación de 5-HT/NE, aumentando su concentración en la sinapsis y potenciando la inhibición del dolor. También bloquea canales de sodio, reduciendo la excitabilidad neuronal." };
            case Medication.Duloxetine:
            case Medication.Venlafaxine: return { title: `Mecanismo de ${selectedMed}`, text: "Bloquea selectivamente los transportadores de recaptación de 5-HT y NE, fortaleciendo las vías descendentes que suprimen la transmisión de la señal de dolor." };
            case Medication.Gabapentin:
            case Medication.Pregabalin: return { title: `Mecanismo de ${selectedMed}`, text: "Se une a la subunidad α2δ de los canales de calcio voltaje-dependientes en el terminal presináptico. Esto inhibe la entrada de calcio y, consecuentemente, reduce la liberación de neurotransmisores excitatorios como el glutamato." };
            case Medication.Carbamazepine: return { title: `Mecanismo de ${selectedMed}`, text: "Bloquea los canales de sodio dependientes de voltaje en la membrana del axón, lo que estabiliza la neurona y previene la generación y propagación de potenciales de acción ectópicos." };
            default: return { title: 'Mecanismo de Acción', text: '' };
        }
    }

    const { title: explanationTitle, text: explanationText } = getExplanation();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 max-w-5xl mx-auto">
            <div className="border-b pb-4 mb-6">
                <h2 className="text-xl font-semibold text-blue-900">Explorador de Mecanismos de Acción Sinápticos</h2>
                <p className="text-sm text-slate-500 mt-1">Visualice cómo los fármacos para el dolor neuropático actúan a nivel de la sinapsis.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2">
                     <svg viewBox="0 0 400 300" className="w-full h-auto bg-slate-50 rounded-lg border">
                        {/* Presynaptic neuron */}
                        <path d="M 200,25 L 150,25 L 150,100 L 100,160 L 300,160 L 250,100 L 250,25 L 200,25 Z" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />
                        
                        {/* Postsynaptic neuron */}
                        <path d="M 150,220 C 150,190 250,190 250,220 A 50 50 0 0 1 150 220 Z" fill="#bbf7d0" stroke="#22c55e" strokeWidth="2" />
                        
                        {/* Labels */}
                        <text x="50" y="20" fontSize="9" fontWeight="bold">NaV</text>
                        <g transform="translate(110, 130)">
                            <rect x="-20" y="-10" width="40" height="20" fill="white" stroke="black" />
                            <text x="0" y="4" textAnchor="middle" fontSize="10">CaV</text>
                             {getTargetState('CA_CHANNEL').isBlocked &&
                                <>
                                    <line x1="-15" y1="-15" x2="15" y2="15" stroke="red" strokeWidth="3"/>
                                    <line x1="15" y1="-15" x2="-15" y2="15" stroke="red" strokeWidth="3"/>
                                </>
                             }
                        </g>

                         <g transform="translate(190, 40)">
                            <rect x="-20" y="-10" width="40" height="20" fill="white" stroke="black" />
                            <text x="0" y="4" textAnchor="middle" fontSize="10">NaV</text>
                             {getTargetState('NA_CHANNEL').isBlocked &&
                                <>
                                    <line x1="-15" y1="-15" x2="15" y2="15" stroke="red" strokeWidth="3"/>
                                    <line x1="15" y1="-15" x2="-15" y2="15" stroke="red" strokeWidth="3"/>
                                </>
                             }
                        </g>

                        <g transform="translate(290, 130)">
                            <rect x="-40" y="-10" width="80" height="20" fill="white" stroke="black" />
                            <text x="0" y="4" textAnchor="middle" fontSize="10">SERT / NERT</text>
                            {getTargetState('REUPTAKE').isBlocked &&
                                <>
                                    <line x1="-35" y1="-15" x2="35" y2="15" stroke="red" strokeWidth="3"/>
                                    <line x1="35" y1="-15" x2="-35" y2="15" stroke="red" strokeWidth="3"/>
                                </>
                             }
                        </g>

                        <g transform="translate(200, 200)">
                            <rect x="-30" y="-10" width="60" height="20" fill="white" stroke="black" />
                            <text x="0" y="4" textAnchor="middle" fontSize="10">Glut - R</text>
                        </g>
                        
                        {/* Vesicle with neurotransmitters */}
                        <circle cx="190" cy="140" r="15" fill="white" stroke="black" />
                        <circle cx="185" cy="145" r="3" fill="red" />
                        <circle cx="195" cy="145" r="3" fill="red" />
                        <circle cx="190" cy="135" r="3" fill="red" />

                        {/* Neurotransmitter release animation */}
                        {!caChannelBlocked && (
                            <g>
                                <circle cx="190" cy="170" r="3" fill="red">
                                    <animate attributeName="cy" from="155" to="190" dur="1s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
                                </circle>
                                 <circle cx="205" cy="170" r="3" fill="red">
                                    <animate attributeName="cy" from="155" to="190" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="1" to="0" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
                                </circle>
                                 <circle cx="175" cy="170" r="3" fill="red">
                                     <animate attributeName="cy" from="155" to="190" dur="0.9s" begin="0.4s" repeatCount="indefinite" />
                                     <animate attributeName="opacity" from="1" to="0" dur="0.9s" begin="0.4s" repeatCount="indefinite" />
                                </circle>
                            </g>
                        )}
                     </svg>
                </div>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-blue-900 mb-2">Seleccionar Fármaco:</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {medications.map(med => (
                                <button key={med} onClick={() => setSelectedMed(med)}
                                    className={`w-full text-center p-2 border rounded-lg transition-all text-xs sm:text-sm ${selectedMed === med ? 'border-blue-800 bg-blue-50 ring-2 ring-blue-500' : 'border-slate-300 hover:border-blue-400'}`}>
                                    {med}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 border-l-4 border-blue-800 rounded-r-lg min-h-[120px]">
                        <p className="text-sm font-semibold text-blue-900 mb-1">{explanationTitle}</p>
                        <p className="text-sm text-slate-700">{explanationText}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PainPathwayExplorer;