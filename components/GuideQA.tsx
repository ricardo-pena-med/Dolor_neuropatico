import Markdown from './MarkdownText';

import React, { useState, useRef, useEffect } from 'react';
import { getAIStatus, getGuideAnswer } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';




const GuideQA: React.FC = () => {
    const [isReady, setIsReady] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        let cancelled = false;
        getAIStatus().then(configured => {
            if (cancelled) return;
            if (!configured) {
                setError('Gemini está pendiente de configuración. Las demás herramientas de la plataforma están disponibles.');
                return;
            }
            setIsReady(true);
            setMessages([{
                role: 'model',
                text: 'Hola. Soy tu asistente especializado en guías clínicas (AAN, EULAR, NeuPSIG). Hazme preguntas sobre definiciones, tratamientos o dosis y responderé basándome en la evidencia cargada.'
            }]);
        }).catch(() => {
            if (!cancelled) setError('No se pudo comprobar la conexión del asistente.');
        });
        return () => { cancelled = true; };
    }, []);

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading || !isReady) return;

        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);
        
        setMessages(prev => [...prev, { role: 'user', text: currentInput }]);
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        try {
            const answer = await getGuideAnswer([...messages, { role: 'user', text: currentInput }]);
            setMessages(prev => {
                const next = [...prev];
                next[next.length - 1] = { role: 'model', text: answer };
                return next;
            });
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = error instanceof Error ? error.message : 'Ha ocurrido un error al procesar tu pregunta.';
             setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text: errorMessage };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (error) {
         return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 max-w-4xl mx-auto text-center">
                 <div className="flex flex-col items-center justify-center p-10 space-y-3 text-red-600 bg-red-50 rounded-lg">
                    <ExclamationTriangleIcon className="w-8 h-8" />
                    <p className="font-medium">Asistente de guías clínicas</p>
                    <p className="text-sm text-red-500">{error}</p>
                </div>
            </div>
         )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 max-w-4xl mx-auto flex flex-col h-[75vh]">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                    <div className="bg-red-700 text-white p-1.5 rounded-full">
                        <SparklesIcon className="w-5 h-5"/>
                    </div>
                    <span>Asistente de Evidencia Clínica (AAN, EULAR, NeuPSIG)</span>
                </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-2xl p-3 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-blue-800 text-white' : 'bg-white text-slate-800 border border-slate-100'}`}>
                           {msg.role === 'user' ? (
                                <p className="text-sm">{msg.text}</p>
                           ) : (
                                <Markdown text={msg.text} />
                           )}
                           {isLoading && msg.role === 'model' && index === messages.length -1 && (
                               <div className="w-2 h-2 bg-blue-800 rounded-full animate-pulse mt-2"></div>
                           )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                    <div className="relative">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ej: ¿Qué es el dolor neuropático? ¿Cómo ajusto la pregabalina en falla renal?"
                            disabled={isLoading || !isReady}
                            className="w-full pr-12 pl-4 py-2.5 border border-slate-300 rounded-full shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            aria-label="Entrada de pregunta"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !userInput.trim() || !isReady}
                            className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-10 m-1 rounded-full bg-blue-800 text-white hover:bg-blue-900 disabled:bg-slate-400 disabled:cursor-not-allowed"
                            aria-label="Enviar pregunta"
                        >
                            <PaperAirplaneIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-center">
                        El asistente responderá preguntas sobre dolor basándose únicamente en las guías proporcionadas.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default GuideQA;
