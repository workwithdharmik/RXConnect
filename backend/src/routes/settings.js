const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { authMiddleware } = require('../utils/jwt');

// GET /api/settings - Retrieve user settings
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Mask the API key if it exists for security
        let maskedApiKey = null;
        if (user.groqApiKey && user.groqApiKey.length > 8) {
            const prefix = user.groqApiKey.substring(0, 4);
            const suffix = user.groqApiKey.substring(user.groqApiKey.length - 4);
            maskedApiKey = `${prefix}...${suffix}`;
        } else if (user.groqApiKey) {
            maskedApiKey = '***'; // Very short keys (unlikely for Groq)
        }

        // Add an indicator whether the environment variable is configured
        const hasEnvKey = !!process.env.GROQ_API_KEY;

        res.json({
            groqApiKeyStatus: maskedApiKey ? 'configured' : 'not_configured',
            maskedApiKey: maskedApiKey,
            fallbackAvailable: hasEnvKey
        });

    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to retrieve settings' });
    }
});

// POST /api/settings - Update user settings
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { groqApiKey } = req.body;

        // Ensure we're not saving empty strings as valid keys; use null instead
        const validKey = (groqApiKey && groqApiKey.trim().length > 0) ? groqApiKey.trim() : null;

        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                groqApiKey: validKey
            }
        });

        res.json({ message: 'Settings updated successfully' });

    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

module.exports = router;
