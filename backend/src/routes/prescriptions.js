const express = require('express');
const { authMiddleware } = require('../utils/jwt');
const prisma = require('../utils/prisma');
const router = express.Router();

// Top 20 common Indian Drugs for autocomplete
const DRUG_DATABASE = [
    'Paracetamol 500mg', 'Paracetamol 650mg', 'Amoxicillin 500mg', 'Azithromycin 500mg',
    'Pantoprazole 40mg', 'Rabeprazole 20mg', 'Cetirizine 10mg', 'Levocetirizine 5mg',
    'Ibuprofen 400mg', 'Diclofenac 50mg', 'Aspirin 75mg', 'Metformin 500mg',
    'Glimepiride 1mg', 'Telmisartan 40mg', 'Amlodipine 5mg', 'Atorvastatin 10mg',
    'Rosuvastatin 10mg', 'Vitamin C 500mg', 'Vitamin D3 60000 IU', 'B-Complex'
];

// Autocomplete Drug Search
router.get('/drugs/search', authMiddleware, (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    if (!query) return res.json(DRUG_DATABASE.slice(0, 10));

    const results = DRUG_DATABASE.filter(drug => drug.toLowerCase().includes(query));
    res.json(results);
});

// GET all prescriptions
router.get('/', authMiddleware, async (req, res) => {
    try {
        const prescs = await prisma.prescription.findMany({
            include: { medicines: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(prescs);
    } catch (error) {
        console.error('Fetch prescriptions error:', error);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
});

// POST new prescription
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { patientId, patientName, diagnosis, medicines, doctorId, audioUrl } = req.body;

        if (!patientId || !medicines || medicines.length === 0) {
            return res.status(400).json({ error: 'Patient ID and at least one medicine belong required' });
        }

        const prescription = await prisma.prescription.create({
            data: {
                patientId,
                patientName,
                doctorId: doctorId || req.user.id,
                date: new Date().toISOString().split('T')[0],
                diagnosis,
                status: 'COMPLETED',
                audioUrl: audioUrl || null,
                medicines: {
                    create: medicines.map(m => ({
                        drugName: m.drugName,
                        dosage: m.dosage,
                        frequency: m.frequency,
                        durationDays: parseInt(m.durationDays, 10) || 3,
                        instructions: m.instructions
                    }))
                }
            },
            include: { medicines: true }
        });

        res.status(201).json({ message: 'Prescription generated successfully', prescription });

    } catch (error) {
        console.error('Create prescription error:', error);
        res.status(500).json({ error: 'Failed to generate prescription' });
    }
});

module.exports = router;
