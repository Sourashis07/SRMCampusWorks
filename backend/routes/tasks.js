import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        poster: { select: { name: true, email: true } },
        bids: { include: { bidder: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, category, budgetMin, budgetMax, deadline, posterId } = req.body;
    
    // Validation
    if (!title || !description || !category || !budgetMin || !budgetMax || !deadline || !posterId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['title', 'description', 'category', 'budgetMin', 'budgetMax', 'deadline', 'posterId']
      });
    }

    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: posterId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate budget
    if (budgetMin < 0 || budgetMax < 0 || budgetMin > budgetMax) {
      return res.status(400).json({ error: 'Invalid budget range' });
    }

    // Validate deadline
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
      return res.status(400).json({ error: 'Invalid deadline - must be a future date' });
    }
    
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        budgetMin: parseInt(budgetMin),
        budgetMax: parseInt(budgetMax),
        deadline: deadlineDate,
        posterId
      },
      include: {
        poster: { select: { name: true, email: true } }
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create task',
      details: error.message 
    });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        poster: { select: { name: true, email: true } },
        bids: { 
          include: { 
            bidder: { select: { name: true, rating: true } },
            group: { include: { members: { include: { user: true } } } }
          } 
        }
      }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get comments for a task
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: req.params.id },
      include: {
        user: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment to a task
router.post('/:id/comments', async (req, res) => {
  try {
    const { comment, userId } = req.body;
    
    const newComment = await prisma.comment.create({
      data: {
        comment,
        taskId: req.params.id,
        userId
      },
      include: {
        user: { select: { name: true } }
      }
    });
    
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { status }
    });
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;