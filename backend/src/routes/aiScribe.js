const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');

const router = express.Router();

// Groq SDK is required
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authMiddleware } = require('../utils/jwt');

// Multer setup for audio upload (Local Disk)
const uploadDir = path.join(__dirname, '../../uploads/audio');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'scribe-' + uniqueSuffix + '.webm');
    }
});
const upload = multer({ storage: storage });

router.post('/scribe', authMiddleware, upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        console.log('Received audio file for AI processing:', req.file.originalname, 'Size:', req.file.size);

        // Construct Audio URL
        const audioUrl = `/uploads/audio/${req.file.filename}`;

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { groqApiKey: true }
        });

        // Use user's key only if it exists and doesn't look like a placeholder/mock
        let activeApiKey = user?.groqApiKey;

        if (!activeApiKey || activeApiKey.includes('MOCK') || activeApiKey.length < 20) {
            console.log("⚠️ Using fallback GROQ_API_KEY from environment");
            activeApiKey = process.env.GROQ_API_KEY;
        }

        if (!activeApiKey) {
            throw new Error("GROQ_API_KEY is not configured. Please set it in Settings or contact administrator.");
        }

        const groq = new Groq({ apiKey: activeApiKey });

        console.log("🎙️ Sending audio to Groq Whisper for Translation...");
        // 1. Read the saved file from disk for Groq
        const filePath = req.file.path;
        const audioFile = fs.createReadStream(filePath);

        // 2. Transcribe AND Translate (Whisper-large-v3)
        const transcription = await groq.audio.translations.create({
            file: audioFile,
            model: "whisper-large-v3",
            response_format: "text",
        });

        const transcriptText = typeof transcription === 'string' ? transcription : transcription.text;
        console.log("📝 Transcript (Translated to English):", transcriptText);

        // 3. Extract structured data using Llama
        console.log("🧠 Extracting structured data with Groq Llama 3...");
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are a medical AI assistant. Extract prescription data from the transcribed text.
Return ONLY a JSON object with the following strictly defined structure:
{
    "diagnosis": "String (Extract the primary diagnosis, symptoms, or condition)",
    "medicines": [
        {
            "name": "String (Drug name)",
            "dosage": "String (e.g., 500mg, 10ml, 1 Tab)",
            "frequency": "String (e.g., 1-0-1, SOS, 1-1-1)",
            "duration": "String (e.g., 5 days)",
            "instructions": "String (e.g., After meals, At night)"
        }
    ],
    "notes": "String (Any general advice, diet, or follow-up instructions)"
}

If you cannot find a specific field, leave it empty. Ensure the JSON is valid.`
                },
                {
                    role: "user",
                    content: transcriptText
                }
            ]
        });

        const structuredData = JSON.parse(completion.choices[0].message.content);

        // Return combined format expected by frontend
        res.json({
            audioUrl: audioUrl,
            transcript: transcriptText,
            structuredData: structuredData
        });

    } catch (error) {
        console.error("AI Scribe Error:", error);
        res.status(500).json({ error: 'Failed to process audio via Groq AI: ' + error.message });
    }
});

module.exports = router;
