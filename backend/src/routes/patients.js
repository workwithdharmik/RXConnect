const express = require('express');
const { authMiddleware } = require('../utils/jwt');
const prisma = require('../utils/prisma');
const router = express.Router();

// GET all patients
router.get('/', authMiddleware, async (req, res) => {
    try {
        const patients = await prisma.patient.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Map DOB to age for frontend compatibility
        const mappedPatients = patients.map(p => ({
            ...p,
            age: p.dob ? new Date().getFullYear() - new Date(p.dob).getFullYear() : 'N/A',
            lastVisit: p.updatedAt.toISOString().split('T')[0]
        }));

        res.json(mappedPatients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});

// POST new patient
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { fullName, age, gender, mobileNo, address, bloodGroup, allergies } = req.body;

        if (!fullName || !mobileNo) {
            return res.status(400).json({ error: 'Full name and mobile number are required' });
        }

        // Generate unique Patient ID
        const count = await prisma.patient.count();
        const nextIdNumber = count + 1;
        const currentYear = new Date().getFullYear();
        const patientId = `CFP-${currentYear}-${nextIdNumber.toString().padStart(5, '0')}`;

        // Calculate approximate DOB from age if provided
        let dob = null;
        if (age) {
            dob = new Date(`${currentYear - parseInt(age)}-01-01T00:00:00.000Z`);
        }

        const newPatient = await prisma.patient.create({
            data: {
                patientId,
                fullName,
                gender: gender || 'Male',
                mobileNo,
                address,
                bloodGroup,
                allergies,
                dob
            }
        });

        res.status(201).json({ message: 'Patient registered successfully', patient: newPatient });

    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('mobileNo')) {
            return res.status(400).json({ error: 'Mobile number already registered.' });
        }
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Failed to register patient' });
    }
});

module.exports = router;
