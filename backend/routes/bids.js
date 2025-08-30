import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create bid
router.post('/', async (req, res) => {
  try {
    const { taskId, amount, proposal, bidderId, groupId } = req.body;
    
    const bid = await prisma.bid.create({
      data: {
        taskId,
        amount,
        proposal,
        bidderId,
        groupId
      }
    });

    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept bid
router.patch('/:id/accept', async (req, res) => {
  try {
    const bid = await prisma.bid.update({
      where: { id: req.params.id },
      data: { status: 'ACCEPTED' }
    });

    // Reject other bids for the same task
    await prisma.bid.updateMany({
      where: {
        taskId: bid.taskId,
        id: { not: req.params.id }
      },
      data: { status: 'REJECTED' }
    });

    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept/Reject bid
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // ACCEPTED or REJECTED
    
    const bid = await prisma.bid.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        task: true,
        bidder: { select: { name: true, email: true } }
      }
    });

    // If accepted, update task status
    if (status === 'ACCEPTED') {
      await prisma.task.update({
        where: { id: bid.taskId },
        data: { status: 'IN_PROGRESS' }
      });
    }

    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;