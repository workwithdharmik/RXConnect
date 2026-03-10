/**
 * Local AI Suggestion Engine for ClinicFlow Pro
 * Maps common diagnoses to standard drug regimens
 */

export const DIAGNOSIS_DRUG_MAP = {
    "Viral Fever": [
        { drugName: "Paracetamol 650mg", dosage: "1 Tab", frequency: "1-0-1", durationDays: 3, instructions: "After meals" },
        { drugName: "Vitamin C 500mg", dosage: "1 Tab", frequency: "1-0-0", durationDays: 5, instructions: "Morning" }
    ],
    "Fever": [
        { drugName: "Paracetamol 650mg", dosage: "1 Tab", frequency: "1-0-1", durationDays: 3, instructions: "After meals" }
    ],
    "Common Cold": [
        { drugName: "Cetirizine 10mg", dosage: "1 Tab", frequency: "0-0-1", durationDays: 5, instructions: "At night" },
        { drugName: "Vitamin C 500mg", dosage: "1 Tab", frequency: "1-0-0", durationDays: 5, instructions: "Morning" }
    ],
    "Acidity": [
        { drugName: "Pantoprazole 40mg", dosage: "1 Cap", frequency: "1-0-0", durationDays: 7, instructions: "Empty stomach" }
    ],
    "Body Ache": [
        { drugName: "Ibuprofen 400mg", dosage: "1 Tab", frequency: "1-0-1", durationDays: 3, instructions: "After meals" },
        { drugName: "Paracetamol 500mg", dosage: "1 Tab", frequency: "1-1-1", durationDays: 2, instructions: "After meals" }
    ],
    "Hypertension": [
        { drugName: "Telmisartan 40mg", dosage: "1 Tab", frequency: "1-0-0", durationDays: 30, instructions: "Morning" },
        { drugName: "Amlodipine 5mg", dosage: "1 Tab", frequency: "0-0-1", durationDays: 30, instructions: "Night" }
    ]
};

export const getSuggestions = (diagnosis) => {
    if (!diagnosis) return [];

    // Fuzzy match
    const key = Object.keys(DIAGNOSIS_DRUG_MAP).find(k =>
        k.toLowerCase().includes(diagnosis.toLowerCase()) ||
        diagnosis.toLowerCase().includes(k.toLowerCase())
    );

    return key ? DIAGNOSIS_DRUG_MAP[key] : [];
};
