
import React, { useMemo } from 'react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlossaryItem: React.FC<{ term: string; children: React.ReactNode }> = ({ term, children }) => (
    <div>
        <dt className="font-semibold text-slate-900">{term}</dt>
        <dd className="mt-1 text-slate-700">{children}</dd>
    </div>
);

const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  
  const terms = useMemo(() => [
    {
        term: "Alodinia",
        def: "Dolor debido a un estímulo que normalmente no provoca dolor (ej. el roce de las sábanas). Signo clínico clave del dolor neuropático periférico."
    },
    {
        term: "Antidepresivos Tricíclicos (ADT)",
        def: "Ej. Amitriptilina. Inhiben la recaptación de serotonina y noradrenalina, potenciando las vías inhibitorias descendentes del dolor. Muy eficaces, pero con un perfil significativo de efectos secundarios anticolinérgicos y cardíacos."
    },
    {
        term: "CYP2D6",
        def: "Una enzima del citocromo P450 crucial en el metabolismo de muchos fármacos, incluyendo Amitriptilina y Duloxetina. Su inhibición (p. ej., por Bupropión) puede aumentar los niveles del fármaco y el riesgo de toxicidad."
    },
    {
        term: "DN4 (Douleur Neuropathique 4)",
        def: "Herramienta de cribado para dolor neuropático de 10 ítems (7 síntomas, 3 signos físicos). Una puntuación ≥ 4/10 tiene alta sensibilidad y especificidad."
    },
    {
        term: "Dolor Neuropático",
        def: "Dolor causado por una lesión o enfermedad del sistema nervioso somatosensorial. A menudo se describe como ardor, hormigueo, descarga eléctrica o punzante (Definición IASP)."
    },
    {
        term: "Gabapentinoides",
        def: "Gabapentina, Pregabalina. Fármacos de primera línea. Actúan sobre las subunidades alfa-2-delta de los canales de calcio dependientes de voltaje en el SNC, reduciendo la liberación de neurotransmisores excitatorios."
    },
    {
        term: "Hiperalgesia",
        def: "Respuesta exagerada a un estímulo que normalmente es doloroso. Indica sensibilización."
    },
    {
        term: "ISRN (Inhibidores de Recaptación Serotonina-Noradrenalina)",
        def: "Ej. Duloxetina, Venlafaxina. Al igual que los ADT, potencian las vías descendentes del dolor pero con un perfil de efectos secundarios generalmente más favorable. Primera línea en neuropatía diabética."
    },
    {
        term: "LANSS (Leeds Assessment of Neuropathic Symptoms and Signs)",
        def: "Escala de evaluación del dolor que distingue entre mecanismos neuropáticos y nociceptivos. Incluye examen sensorial."
    },
    {
        term: "Neuralgia Postherpética (PHN)",
        def: "Dolor que persiste por más de 3 meses en el mismo dermatoma después de un episodio de herpes zóster. El riesgo aumenta con la edad."
    },
    {
        term: "Neuropatía Diabética Dolorosa (PDN)",
        def: "La complicación más común de la diabetes mellitus. Afecta los nervios periféricos, típicamente en un patrón de 'guante y calcetín', causando dolor y pérdida de sensibilidad."
    },
    {
        term: "Sensibilización Central",
        def: "Aumento de la capacidad de respuesta de las neuronas nociceptivas en el sistema nervioso central a su entrada aferente normal o subumbral."
    }
  ].sort((a, b) => a.term.localeCompare(b.term)), []);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 transition-opacity"
        aria-labelledby="glossary-title"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200">
            <h2 id="glossary-title" className="text-lg font-semibold text-blue-900">Glosario de Dolor Neuropático</h2>
            <p className="text-sm text-slate-600 mt-1">Definiciones clave para la evaluación y farmacoterapia.</p>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
          <dl className="space-y-6">
            {terms.map((item) => (
                <GlossaryItem key={item.term} term={item.term}>
                    {item.def}
                </GlossaryItem>
            ))}
          </dl>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-end">
            <button
                type="button"
                className="px-4 py-2 bg-blue-800 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={onClose}
            >
                Entendido
            </button>
        </div>
      </div>
    </div>
  );
};

export default GlossaryModal;
