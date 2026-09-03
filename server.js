const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



// Counseling Booking API Endpoint
app.post('/api/counseling', (req, res) => {
    const bookingData = req.body;
    console.log('New Counseling Request Received:', bookingData);
    
    res.json({ success: true, message: 'Request recorded successfully!' });
});

// Vercel Serverless Export
module.exports = app;