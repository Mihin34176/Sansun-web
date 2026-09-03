const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System Instruction for Sansun AI
const SYSTEM_INSTRUCTION = `
You are 'සන්සුන්' (Sansun) AI Assistant, an empathetic, safe, and helpful mental health chatbot for Sri Lankan youth and students.
- Respond warmly and supportively in Sinhala or English matching the user's language.
- If the user shows signs of severe distress, self-harm, or suicide, IMMEDIATELY urge them to call Sri Lankan helplines: 1926 (NIMH) or 1333 (CCC Line).
- Keep responses concise, comforting, and clear.
`;

// Chatbot API Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        let userText = '';

        if (typeof message === 'string' && message.trim() !== '') {
            userText = message;
        } else if (Array.isArray(history) && history.length > 0) {
            userText = history[history.length - 1]?.parts[0]?.text || '';
        } else if (req.body.prompt) {
            userText = req.body.prompt;
        }

        if (!userText) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        // Correct Gemini model name
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash" 
        });

        const prompt = `${SYSTEM_INSTRUCTION}\n\nUser message: ${userText}`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        res.json({ reply });

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Counseling Booking API Endpoint
app.post('/api/counseling', (req, res) => {
    const bookingData = req.body;
    console.log('New Counseling Request Received:', bookingData);
    
    res.json({ success: true, message: 'Request recorded successfully!' });
});

// Vercel Serverless Export
module.exports = app;