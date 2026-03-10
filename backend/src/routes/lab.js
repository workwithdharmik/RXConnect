const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { authMiddleware } = require('../utils/jwt');
const communicationService = require('../utils/communication');

// GET lab stats (count of pending reports)
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const pendingCount = await prisma.labOrder.count({
            where: {
                doctorId: req.user.id,
                status: 'PENDING'
            }
        });
        res.json({ pendingCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET pending lab orders for dashboard "Action Items"
router.get('/pending', authMiddleware, async (req, res) => {
    try {
        const pendingOrders = await prisma.labOrder.findMany({
            where: {
                doctorId: req.user.id,
                status: 'PENDING'
            },
            include: {
                patient: true
            },
            orderBy: {
                orderedAt: 'desc'
            },
            take: 5
        });
        res.json(pendingOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all lab tests (for search/dropdown)
router.get('/tests', authMiddleware, async (req, res) => {
    try {
        const tests = await prisma.labTest.findMany();
        res.json(tests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new lab order
router.post('/orders', authMiddleware, async (req, res) => {
    try {
        const { patientId, doctorId, testNames, instructions } = req.body;

        const order = await prisma.labOrder.create({
            data: {
                patientId,
                doctorId: doctorId || req.user.id,
                testNames,
                instructions,
                status: 'PENDING'
            },
            include: {
                patient: true,
                doctor: {
                    select: { name: true, specialization: true }
                }
            }
        });

        // Trigger Notification (Async)
        if (order.patient) {
            communicationService.sendLabOrderNotification(order.patient, order)
                .catch(err => console.error('Failed to send lab notification:', err));
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get orders for a specific patient
router.get('/orders/patient/:patientId', authMiddleware, async (req, res) => {
    try {
        const { patientId } = req.params;
        const orders = await prisma.labOrder.findMany({
            where: { patientId },
            include: {
                doctor: {
                    select: { name: true }
                }
            },
            orderBy: { orderedAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
