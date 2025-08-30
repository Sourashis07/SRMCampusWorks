import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize Razorpay only if keys are provided
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Create payment order (simplified for demo)
router.post('/create-order', async (req, res) => {
  try {
    const { taskId, amount, payerId } = req.body;
    
    const transaction = await prisma.transaction.create({
      data: {
        razorpayOrderId: `order_${Date.now()}`,
        amount,
        taskId,
        payerId,
        status: 'COMPLETED' // Simulate immediate success for demo
      }
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default router;