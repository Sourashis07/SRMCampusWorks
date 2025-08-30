import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Sync Firebase user with database
router.post('/sync', async (req, res) => {
  try {
    const { uid, email, name } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ error: 'UID and email are required' });
    }
    
    // Check if user exists by ID
    let user = await prisma.user.findUnique({
      where: { id: uid }
    });

    if (!user) {
      // Check if user exists by email
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        // Update existing user with new Firebase UID
        user = await prisma.user.update({
          where: { email },
          data: {
            id: uid,
            name: name || existingUser.name
          }
        });
        console.log('Updated existing user with new UID:', user.id);
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            id: uid,
            email,
            name: name || email.split('@')[0],
            skills: [],
            department: '',
            year: 1
          }
        });
        console.log('Created new user:', user.id);
      }
    } else {
      // Update existing user info
      user = await prisma.user.update({
        where: { id: uid },
        data: {
          email,
          name: name || user.name
        }
      });
      console.log('Updated existing user:', user.id);
    }

    res.json(user);
  } catch (error) {
    console.error('Auth sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;