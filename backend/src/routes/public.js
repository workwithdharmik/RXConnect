const express = require('express');
const prisma = require('../utils/prisma');
const router = express.Router();

// Public endpoint for Patient Portal access
router.get('/portal/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const patient = await prisma.patient.findUnique({
            where: { patientId },
            include: {
                prescriptions: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        doctor: { select: { name: true, specialization: true } },
                        medicines: true
                    }
                },
                labOrders: {
                    orderBy: { orderedAt: 'desc' },
                    include: {
                        doctor: { select: { name: true } }
                    }
                }
            }
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Return a safe subset of patient data
        res.json({
            patientId: patient.patientId,
            fullName: patient.fullName,
            gender: patient.gender,
            mobileNo: patient.mobileNo,
            prescriptions: patient.prescriptions,
            labOrders: patient.labOrders
        });
    } catch (error) {
        console.error('[PUBLIC API] Error:', error);
        res.status(500).json({ error: 'Failed to fetch medical records' });
    }
});

module.exports = router;
