import type { PsychiatricScaleType, ScaleResult, ClinicalAssessment } from '../types/visit';

interface SeverityBand {
    maxScore: number;
    key: string;
}

interface ScaleConfig {
    severityBands: SeverityBand[];
    loincCode: string;
    fieldKey: string;
}

const SCALE_CONFIGS: Record<PsychiatricScaleType, ScaleConfig> = {
    'HAM-D': {
        severityBands: [
            { maxScore: 7, key: 'none' },
            { maxScore: 13, key: 'mild' },
            { maxScore: 18, key: 'moderate' },
            { maxScore: 22, key: 'severe' },
            { maxScore: Infinity, key: 'verySevere' },
        ],
        loincCode: '48544-1',
        fieldKey: 'hamd',
    },
    'MADRS': {
        severityBands: [
            { maxScore: 6, key: 'none' },
            { maxScore: 19, key: 'mild' },
            { maxScore: 34, key: 'moderate' },
            { maxScore: Infinity, key: 'severe' },
        ],
        loincCode: '69654-3',
        fieldKey: 'madrs',
    },
    'ASRS': {
        severityBands: [
            { maxScore: 1, key: 'unlikely' },
            { maxScore: 3, key: 'possible' },
            { maxScore: Infinity, key: 'highlyLikely' },
        ],
        loincCode: '71133-5',
        fieldKey: 'asrs',
    },
    'HAM-A': {
        severityBands: [
            { maxScore: 16, key: 'mild' },
            { maxScore: 24, key: 'moderate' },
            { maxScore: 30, key: 'severe' },
            { maxScore: Infinity, key: 'verySevere' },
        ],
        loincCode: '70274-8',
        fieldKey: 'hama',
    },
    'ISI': {
        severityBands: [
            { maxScore: 7, key: 'noInsomnia' },
            { maxScore: 14, key: 'subthreshold' },
            { maxScore: 21, key: 'moderate' },
            { maxScore: Infinity, key: 'severe' },
        ],
        loincCode: '70271-4',
        fieldKey: 'isi',
    },
    'CARS-2': {
        severityBands: [
            { maxScore: 25, key: 'noAutism' },
            { maxScore: 30, key: 'mildToModerate' },
            { maxScore: 36, key: 'moderate' },
            { maxScore: Infinity, key: 'severe' },
        ],
        loincCode: '71133-5',
        fieldKey: 'cars2',
    },
};

const ASRS_PART_A_CRITICAL_THRESHOLDS: Record<number, number> = {
    1: 2, 2: 2, 3: 2, 4: 2, 5: 3, 6: 3,
};

export function getSeverityKey(scaleType: PsychiatricScaleType, score: number): string {
    const config = SCALE_CONFIGS[scaleType];
    for (const band of config.severityBands) {
        if (score <= band.maxScore) return band.key;
    }
    return config.severityBands[config.severityBands.length - 1].key;
}

export function getScaleFieldKey(scaleType: PsychiatricScaleType): string {
    return SCALE_CONFIGS[scaleType].fieldKey;
}

export function getSeverityColor(scaleType: PsychiatricScaleType, score: number): string {
    const key = getSeverityKey(scaleType, score);
    const greenKeys = ['none', 'noInsomnia', 'noAutism', 'unlikely'];
    const yellowKeys = ['mild', 'subthreshold', 'mildToModerate', 'possible'];
    const orangeKeys = ['moderate'];
    if (greenKeys.includes(key)) return '#22C55E';
    if (yellowKeys.includes(key)) return '#F59E0B';
    if (orangeKeys.includes(key)) return '#F97316';
    return '#EF4444';
}

/**
 * Calculate ASRS score using Part A critical-symptom counting.
 * Returns the number of critical symptoms in Part A (questions 1-6).
 */
export function calculateASRSScore(answers: Record<number, number>): { criticalCount: number; totalPartB: number } {
    let criticalCount = 0;
    let totalPartB = 0;

    Object.entries(answers).forEach(([qIdx, optionIdx]) => {
        const questionNumber = parseInt(qIdx) + 1;
        if (questionNumber <= 6) {
            const threshold = ASRS_PART_A_CRITICAL_THRESHOLDS[questionNumber] ?? 2;
            if (optionIdx >= threshold) criticalCount++;
        } else {
            totalPartB += optionIdx;
        }
    });

    return { criticalCount, totalPartB };
}

/**
 * Calculate the raw score from answers.
 * For most scales this is a simple sum; for MADRS, options map to 0/2/4/6.
 */
export function calculateRawScore(
    scaleType: PsychiatricScaleType,
    answers: Record<number, number>,
): number {
    if (scaleType === 'ASRS') {
        return calculateASRSScore(answers).criticalCount;
    }
    if (scaleType === 'MADRS') {
        return Object.values(answers).reduce((sum, idx) => sum + idx * 2, 0);
    }
    if (scaleType === 'CARS-2') {
        return Object.values(answers).reduce((sum, idx) => sum + (idx + 1), 0);
    }
    return Object.values(answers).reduce((sum, idx) => sum + idx, 0);
}

export function buildScaleResult(
    scaleType: PsychiatricScaleType,
    answers: Record<number, number>,
    t: (key: string, params?: any) => string,
): ScaleResult {
    const score = calculateRawScore(scaleType, answers);
    const severityKey = getSeverityKey(scaleType, score);
    const scaleI18nKey = scaleType.replace('-', '').toLowerCase() + 'Scale';

    const interpretation = t(`${scaleI18nKey}.interpretation.${severityKey}.title`);
    const details = t(`${scaleI18nKey}.interpretation.${severityKey}.details`);

    let resultText: string;
    if (scaleType === 'ASRS') {
        const { criticalCount, totalPartB } = calculateASRSScore(answers);
        resultText = t(`${scaleI18nKey}.interpretation.result`, {
            criticalSymptoms: criticalCount,
            totalScore: totalPartB,
            interpretation,
        });
    } else {
        resultText = t(`${scaleI18nKey}.interpretation.result`, {
            score,
            interpretation,
        });
    }

    return {
        type: scaleType,
        score,
        interpretation,
        severityKey,
        date: new Date().toISOString(),
        details: `${resultText}\n\n${details}`,
    };
}

export function buildFHIRAssessment(result: ScaleResult): ClinicalAssessment {
    const config = SCALE_CONFIGS[result.type];
    return {
        resourceType: 'Observation',
        id: Date.now().toString(),
        status: 'final',
        category: [{
            coding: [{
                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'survey',
                display: 'Survey',
            }],
        }],
        code: {
            coding: [{
                system: 'http://loinc.org',
                code: config.loincCode,
                display: result.type,
            }],
        },
        subject: { reference: 'Patient/example' },
        effectiveDateTime: result.date,
        performer: [{ reference: 'Practitioner/example' }],
        valueQuantity: {
            value: result.score,
            unit: 'points',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
        },
        interpretation: [{
            coding: [{
                system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                code: 'N',
                display: 'Normal',
            }],
            text: result.interpretation,
        }],
        note: [{ text: result.details }],
    };
}
