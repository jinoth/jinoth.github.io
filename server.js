require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test the transporter connection
transporter.verify(function(error, success) {
    if (error) {
        console.log('Server error:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        console.log('Received form data:', { name, email, message });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Message from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Message: ${message}
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email', 
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 