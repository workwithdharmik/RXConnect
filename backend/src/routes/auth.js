const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const prisma = require('../utils/prisma');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { mobile, password } = req.body;

        // Simulate DB query delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Basic Validation
        if (!mobile || !password) {
            return res.status(400).json({ error: 'Mobile number and password are required' });
        }

        // Find User
        const cleanMobile = mobile.replace(/[^0-9]/g, '');
        const user = await prisma.user.findUnique({
            where: { mobile: cleanMobile }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = generateToken({ id: user.id, role: user.role, name: user.name });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                mobile: user.mobile
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
