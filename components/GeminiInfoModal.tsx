import Markdown from './MarkdownText';
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

interface GeminiInfoModalProps {
  isOpen: boolean;
  isLoading: boolean;
  content: string;
  recommendation: string;
  isError: boolean;
  onClose: () => void;
}

// A simple markdown to HTML converter



const GeminiInfoModal: React.FC<GeminiInfoModalProps> = ({ isOpen, isLoading, content, recommendation, isError, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 transition-opacity"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200">
            <h2 id="modal-title" className="text-lg font-semibold text-slate-900">Análisis Detallado</h2>
            <p className="text-sm text-slate-600 mt-1">"{recommendation}"</p>
        </div>

        <div className="p-6 flex-grow overflow-y-auto min-h-[150px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3 text-slate-500">
                <SparklesIcon className="w-8 h-8 animate-pulse text-red-700" />
                <p>Consultando a Gemini para obtener más detalles...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3 text-red-600 bg-red-50 rounded-lg p-4">
                <ExclamationTriangleIcon className="w-8 h-8" />
                <p className="font-medium">Información no disponible</p>
                <p className="text-center text-sm text-red-500">{content}</p>
            </div>
          ) : (
            <article>
              <Markdown text={content} />
            </article>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-between items-center">
             <div className="flex items-center gap-2 text-xs text-slate-500">
                <SparklesIcon className="w-4 h-4 text-slate-500" />
                <span>{isError ? 'Conexión con Gemini' : 'Análisis generado por Gemini'}</span>
            </div>
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

export default GeminiInfoModal;
