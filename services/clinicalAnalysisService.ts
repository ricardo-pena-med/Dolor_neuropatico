
import { PatientProfile, MedicationAnalysis, ChecklistItemData, ChecklistLevel, Medication, ConcomitantDrug } from '../types';

const createItem = (level: ChecklistLevel, keyword: string, description: string): ChecklistItemData => {
    const text = `${keyword}: ${description}`;
    return { id: text, text, level, keyword };
};

const medicationsToAnalyze = [
    Medication.Amitriptyline, 
    Medication.Nortriptyline, 
    Medication.Duloxetine, 
    Medication.Venlafaxine,
    Medication.Gabapentin, 
    Medication.Pregabalin,
    Medication.LidocainePatch, 
    Medication.Capsaicin,
    Medication.Tramadol, 
    Medication.Carbamazepine
];

export function analyzeScenario(profile: PatientProfile): MedicationAnalysis[] {
    const { diagnosis, age, insuficienciaRenal, cardiopatia, riesgoSuicida, estrenimiento, glaucoma, hypotensionRisk, somnolencia, concomitantDrugs } = profile;

    const analysisResults: MedicationAnalysis[] = [];

    for (const med of medicationsToAnalyze) {
        const analysis: MedicationAnalysis = { medication: med, dangers: [], warnings: [], successes: [], infos: [] };

        // --- AMITRIPTYLINE (TCA) ---
        if (med === Medication.Amitriptyline) {
            if (age > 65) {
                analysis.dangers.push(createItem('danger', 'Criterios Beers', 'Evitar en adultos mayores por efectos anticolinérgicos y riesgo de caídas. Preferir Nortriptilina.'));
            } else {
                 if (diagnosis === 'NEUROPATIA_DIABETICA' || diagnosis === 'NEURALGIA_POSTHERPETICA') {
                    analysis.successes.push(createItem('success', '1ª Línea (NeuPSIG 2015)', 'Nivel A de evidencia. NNT 3.6.'));
                } else if (diagnosis === 'FIBROMYALGIA') {
                    analysis.successes.push(createItem('success', 'EULAR 2017', 'Recomendación débil a favor para trastornos del sueño/dolor.'));
                }
            }
            
            if (cardiopatia) analysis.dangers.push(createItem('danger', 'Contraindicado', 'Riesgo de arritmias/QTc. Evitar en cardiopatía (AAN 2022).'));
            if (glaucoma || estrenimiento) analysis.dangers.push(createItem('danger', 'Efectos Anticolinérgicos', 'Puede exacerbar glaucoma y estreñimiento.'));
            if (hypotensionRisk) analysis.warnings.push(createItem('warning', 'Hipotensión Ortostática', 'Riesgo moderado-alto.'));
        }

        // --- NORTRIPTYLINE (TCA - Safer Alternative) ---
        if (med === Medication.Nortriptyline) {
             if (diagnosis === 'NEUROPATIA_DIABETICA' || diagnosis === 'NEURALGIA_POSTHERPETICA') {
                analysis.successes.push(createItem('success', '1ª Línea (Alternativa)', 'Metabolito de amitriptilina. Igual eficacia analgésica.'));
            }
            
            if (age > 65) {
                analysis.successes.push(createItem('success', 'Perfil Geriátrico', 'Menor efecto anticolinérgico y sedante que Amitriptilina. Preferible en >65 años.'));
            }
            
            if (cardiopatia) analysis.warnings.push(createItem('warning', 'Precaución Cardíaca', 'Menor riesgo que amitriptilina, pero requiere monitoreo ECG.'));
        }

        // --- DULOXETINE & VENLAFAXINE (SNRI) ---
        if (med === Medication.Duloxetine || med === Medication.Venlafaxine) {
            if (diagnosis === 'NEUROPATIA_DIABETICA' || diagnosis === 'FIBROMYALGIA') {
                 analysis.successes.push(createItem('success', '1ª Línea', `Evidencia sólida para ${diagnosis === 'FIBROMYALGIA' ? 'Fibromialgia' : 'PDN'} (AAN 2022/EULAR).`));
            } else if (diagnosis === 'LUMBALGIA_NEUROPATICA') {
                 analysis.successes.push(createItem('success', 'Opción Válida', 'Duloxetina tiene indicación para dolor lumbar crónico.'));
            }

            if (insuficienciaRenal && med === Medication.Duloxetine) {
                analysis.dangers.push(createItem('danger', 'Contraindicado', 'No usar si ClCr < 30 mL/min.'));
            } else if (insuficienciaRenal && med === Medication.Venlafaxine) {
                analysis.warnings.push(createItem('warning', 'Ajuste Renal', 'Reducir dosis 25-50% si ClCr 10-70 mL/min.'));
            }
            
            if (med === Medication.Venlafaxine && cardiopatia) analysis.warnings.push(createItem('warning', 'Hipertensión', 'Puede aumentar PA dosis-dependiente.'));
        }
        
        // --- GABAPENTINOIDS ---
        if (med === Medication.Gabapentin || med === Medication.Pregabalin) {
            analysis.successes.push(createItem('success', '1ª Línea Universal', 'Eficaz en PDN, PHN y dolor neuropático general (NeuPSIG/AAN).'));
            
            if (insuficienciaRenal) {
                if (med === Medication.Pregabalin) {
                     // CORRECCIÓN: Cambiado de 'danger' a 'warning' para permitir uso con ajuste
                     analysis.warnings.push(createItem('warning', 'Ajuste Renal Requerido', 'ClCr 30-60 mL/min: Dosis máx 300 mg/día (50%). ClCr 15-30: Dosis máx 150 mg/día.'));
                } else {
                     // CORRECCIÓN: Cambiado de 'danger' a 'warning'
                     analysis.warnings.push(createItem('warning', 'Ajuste Renal Requerido', 'ClCr 30-60 mL/min: Dosis máx 1400 mg/día. ClCr 15-30: Dosis máx 700 mg/día.'));
                }
            }
            if (somnolencia || age > 65) analysis.warnings.push(createItem('warning', 'SNC', 'Sedación y mareo frecuentes. Titular lento.'));
             if (concomitantDrugs.includes(ConcomitantDrug.Opioids)) {
                analysis.dangers.push(createItem('danger', 'Alerta FDA', 'Depresión respiratoria potenciada con opioides.'));
            }
        }

        // --- LIDOCAINE PATCH ---
        if (med === Medication.LidocainePatch) {
            if (diagnosis === 'NEURALGIA_POSTHERPETICA' || diagnosis === 'NEUROPATIA_DIABETICA') {
                 analysis.successes.push(createItem('success', '2ª Línea (NeuPSIG)', 'Excelente perfil de seguridad. Ideal para dolor localizado y alodinia.'));
            }
            if (age > 65) analysis.successes.push(createItem('success', 'Seguridad Geriátrica', 'Sin efectos sistémicos ni interacciones. Ideal en anciano frágil.'));
        }
        
        // --- TRAMADOL ---
        if (med === Medication.Tramadol) {
             analysis.infos.push(createItem('info', '2ª Línea / Rescate', 'Opción para exacerbaciones agudas o rescate (NeuPSIG 2015).'));
             analysis.warnings.push(createItem('warning', 'Precaución AAN 2022', 'No recomendado como primera línea en PDN por riesgo de abuso y eficacia a largo plazo incierta.'));
             if (concomitantDrugs.includes(ConcomitantDrug.SSRIs) || concomitantDrugs.includes(ConcomitantDrug.Bupropion)) {
                 analysis.dangers.push(createItem('danger', 'Interacción Grave', 'Riesgo de Síndrome Serotoninérgico y convulsiones.'));
             }
             if (age > 75) analysis.warnings.push(createItem('warning', 'Ancianos', 'Riesgo de confusión y caídas.'));
        }
        
        // --- CAPSAICIN ---
        if (med === Medication.Capsaicin) {
            if (diagnosis === 'NEUROPATIA_DIABETICA' || diagnosis === 'NEURALGIA_POSTHERPETICA') {
                 analysis.successes.push(createItem('success', '2ª Línea (NeuPSIG)', 'Útil si hay intolerancia oral.'));
            }
        }

        // --- CARBAMAZEPINE ---
        if (med === Medication.Carbamazepine) {
             analysis.infos.push(createItem('info', 'Uso Restringido', '1ª línea SOLO para Neuralgia del Trigémino.'));
             analysis.dangers.push(createItem('danger', 'No Recomendado', 'Evidencia débil/negativa para PDN o PHN. Muchos efectos adversos e interacciones.'));
        }

        analysisResults.push(analysis);
    }
    
    return analysisResults;
}


export function buildChecklistFromAnalysis(analysis: MedicationAnalysis, profile: PatientProfile): ChecklistItemData[] {
    const { dangers, warnings, successes, infos } = analysis;
    const items: ChecklistItemData[] = [];
    
    // Cross-cutting warnings
    if (profile.concomitantDrugs.includes(ConcomitantDrug.Opioids) && analysis.medication !== Medication.Tramadol) {
         items.push(createItem('warning', 'Opioides Previos', 'Evaluar reducción de opioides al iniciar terapia coadyuvante.'));
    }

    const combined = [...dangers, ...warnings, ...successes, ...infos];
    const uniqueItems = new Map<string, ChecklistItemData>();
    
    items.forEach(item => uniqueItems.set(item.id, item));
    combined.forEach(item => {
        if (!uniqueItems.has(item.id)) {
            uniqueItems.set(item.id, item);
        }
    });

    return Array.from(uniqueItems.values());
}
