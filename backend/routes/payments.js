import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
router.post('/create-order', async (req, res) => {
  try {
    const { taskId, amount } = req.body;
    
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `task_${taskId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    // Save transaction to database
    await prisma.transaction.create({
      data: {
        razorpayOrderId: order.id,
        amount: amount,
        taskId: taskId,
        payerId: req.user.id, // Assuming auth middleware sets req.user
        status: 'PENDING'
      }
    });

    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Update transaction status
      await prisma.transaction.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: { status: 'COMPLETED' }
      });

      // Update task status to IN_PROGRESS
      const transaction = await prisma.transaction.findUnique({
        where: { razorpayOrderId: razorpay_order_id }
      });

      await prisma.task.update({
        where: { id: transaction.taskId },
        data: { status: 'IN_PROGRESS' }
      });

      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Release payment to worker
router.post('/release-payment', async (req, res) => {
  try {
    const { taskId } = req.body;
    
    // Mark task as completed and release payment
    await prisma.task.update({
      where: { id: taskId },
      data: { status: 'COMPLETED' }
    });

    // In a real implementation, you would transfer money to worker's account
    // This is a simplified version
    
    res.json({ success: true, message: 'Payment released successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create payment order
router.post('/create-order', async (req, res) => {
  try {
    const { taskId, amount, payerId } = req.body;
    
    const transaction = await prisma.transaction.create({
      data: {
        razorpayOrderId: `order_${Date.now()}`, // In real app, use Razorpay API
        amount,
        taskId,
        payerId,
        status: 'COMPLETED' // Simulate immediate success
      }
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;