import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create group
router.post('/', async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    
    const group = await prisma.group.create({
      data: {
        name,
        description,
        members: {
          create: memberIds.map((userId, index) => ({
            userId,
            role: index === 0 ? 'leader' : 'member'
          }))
        }
      },
      include: {
        members: { include: { user: true } }
      }
    });

    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's groups
router.get('/user/:userId', async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: { userId: req.params.userId }
        }
      },
      include: {
        members: { include: { user: true } }
      }
    });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;