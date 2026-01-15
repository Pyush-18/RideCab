import express from "express";
import { sendContactNotification } from "../services/emailService.js";

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const { name, email, phone, message, type } = req.body;

    if (!name || !email || !phone || !message || !type) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    const result = await sendContactNotification({
      name,
      email,
      phone,
      message,
      type, 
    });

    if (result.success) {
      res.status(200).json({ 
        success: true,
        message: 'Message sent successfully',
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to send email',
        details: result.error 
      });
    }
  } catch (error) {
    console.error('Contact route error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

export default router;