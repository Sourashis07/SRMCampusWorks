import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        postedTasks: { select: { id: true, title: true, status: true } },
        bids: { 
          include: { 
            task: { select: { title: true } } 
          } 
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { name, email, department, year, skills, bio, phone, portfolio } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name,
        email,
        department,
        year,
        skills,
        bio,
        phone,
        portfolio
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;