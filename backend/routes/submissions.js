import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create submission
router.post('/', async (req, res) => {
  try {
    const { description, fileUrl, linkUrl, taskId, submitterId } = req.body;
    
    const submission = await prisma.submission.create({
      data: {
        description,
        fileUrl,
        linkUrl,
        taskId,
        submitterId
      },
      include: {
        task: { select: { title: true } },
        submitter: { select: { name: true } }
      }
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get submission by task ID
router.get('/task/:taskId', async (req, res) => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { taskId: req.params.taskId },
      include: {
        submitter: { select: { name: true, email: true } }
      }
    });

    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update submission status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const submission = await prisma.submission.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;