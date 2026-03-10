const express = require('express');
const { authMiddleware } = require('../utils/jwt');
const prisma = require('../utils/prisma');
const router = express.Router();

// GET all doctors (for selection lists)
router.get('/doctors', authMiddleware, async (req, res) => {
    try {
        const doctors = await prisma.user.findMany({
            where: {
                role: { in: ['DOCTOR', 'ADMIN'] }
            },
            select: {
                id: true,
                name: true,
                specialization: true,
                qualification: true
            }
        });
        res.json(doctors);
    } catch (error) {
        console.error('Fetch doctors error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET current user profile
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                mobile: true,
                role: true,
                qualification: true,
                specialization: true,
                registrationNo: true,
                bio: true,
                clinicName: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Fetch profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE user profile
router.put('/', authMiddleware, async (req, res) => {
    try {
        const { name, qualification, specialization, registrationNo, bio, clinicName } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                name,
                qualification,
                specialization,
                registrationNo,
                bio,
                clinicName
            },
            select: {
                id: true,
                name: true,
                mobile: true,
                role: true,
                qualification: true,
                specialization: true,
                registrationNo: true,
                bio: true,
                clinicName: true
            }
        });

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
