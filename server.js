const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

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

// 1. Chatbot API Endpoint
// Available Models බලන Endpoint එක
app.get('/api/models', async (req, res) => {
    try {
        // API Key එකෙන් support කරන models list එක ගන්නවා
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { history } = req.body;

        if (!history || !Array.isArray(history)) {
            return res.status(400).json({ error: 'Invalid history format' });
        }

        // Get the latest user message
        const lastUserMessage = history[history.length - 1]?.parts[0]?.text || '';

        // Working model name for active accounts
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.1-flash-lite"
        });

        // Combine System Prompt with User Prompt
        const prompt = `${SYSTEM_INSTRUCTION}\n\nUser message: ${lastUserMessage}`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        res.json({ reply });

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});
// 2. Counseling Booking API Endpoint
app.post('/api/counseling', (req, res) => {
    const bookingData = req.body;
    console.log('New Counseling Request Received:', bookingData);
    
    res.json({ success: true, message: 'Request recorded successfully!' });
});

// Server Start
app.listen(PORT, () => {
    console.log(`Sansun Backend is running on http://localhost:${PORT}`);
});