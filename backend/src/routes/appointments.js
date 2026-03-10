const express = require('express');
const { authMiddleware } = require('../utils/jwt');
const prisma = require('../utils/prisma');
const communicationService = require('../utils/communication');
const router = express.Router();

// GET today's appointments
router.get('/today', authMiddleware, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const todaysApts = await prisma.appointment.findMany({
            where: { date: today },
            include: {
                doctor: { select: { name: true, specialization: true } },
                patient: { select: { patientId: true } }
            },
            orderBy: { timeSlot: 'asc' }
        });

        res.json(todaysApts);
    } catch (error) {
        console.error('Fetch today apt error:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// GET all appointments
router.get('/', authMiddleware, async (req, res) => {
    try {
        const sorted = await prisma.appointment.findMany({
            include: { doctor: { select: { name: true, specialization: true } } },
            orderBy: [
                { date: 'desc' },
                { timeSlot: 'desc' }
            ]
        });
        res.json(sorted);
    } catch (error) {
        console.error('Fetch all apt error:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});


// POST new appointment
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { patientName, patientMobile, date, timeStr, timeSlot, type, doctorId } = req.body;

        if (!patientName || !date || !timeSlot) {
            return res.status(400).json({ error: 'Patient Name, Date, and Time are required' });
        }

        const targetDoctorId = doctorId || req.user.id;

        // Double Booking Check (Per Doctor)
        const isConflict = await prisma.appointment.findFirst({
            where: { date, timeSlot, doctorId: targetDoctorId, status: 'SCHEDULED' }
        });

        if (isConflict) {
            return res.status(409).json({ error: 'This time slot is already booked for the selected doctor.' });
        }

        // --- PATIENT LINKING LOGIC ---
        let linkedPatientId = null;
        try {
            let existingPatient = await prisma.patient.findUnique({
                where: { mobileNo: patientMobile }
            });

            if (existingPatient) {
                linkedPatientId = existingPatient.id;
            } else {
                const count = await prisma.patient.count();
                const nextIdNumber = count + 1;
                const currentYear = new Date().getFullYear();
                const generatedPatientId = `CFP-${currentYear}-${nextIdNumber.toString().padStart(5, '0')}`;

                // Approximate DOB from age
                let dob = null;
                if (req.body.age) {
                    dob = new Date(`${currentYear - parseInt(req.body.age)}-01-01T00:00:00.000Z`);
                }

                const newPatient = await prisma.patient.create({
                    data: {
                        patientId: generatedPatientId,
                        fullName: patientName,
                        gender: req.body.gender || 'Male',
                        mobileNo: patientMobile,
                        dob
                    }
                });
                linkedPatientId = newPatient.id;
            }
        } catch (linkError) {
            console.error('CRITICAL: Patient linking/creation failed:', linkError);
        }
        // -----------------------------

        const newApt = await prisma.appointment.create({
            data: {
                patientId: linkedPatientId,
                patientName,
                patientMobile: patientMobile || '',
                date,
                timeStr,
                timeSlot,
                type: type || 'NEW',
                status: 'SCHEDULED',
                doctorId: targetDoctorId,
            },
            include: {
                doctor: { select: { name: true, specialization: true } },
                patient: { select: { patientId: true } }
            }
        });

        // Trigger Notification (Async)
        communicationService.sendAppointmentConfirmation(
            { fullName: patientName, mobileNo: patientMobile },
            newApt
        ).catch(err => console.error('Failed to send appointment confirmation:', err));

        res.status(201).json({ message: 'Appointment scheduled', appointment: newApt });

    } catch (error) {
        console.error('Schedule apt error:', error);
        res.status(500).json({ error: 'Failed to schedule appointment' });
    }
});

module.exports = router;
