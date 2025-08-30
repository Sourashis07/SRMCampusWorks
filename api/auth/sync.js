import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid, email, name } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ error: 'UID and email are required' });
    }
    
    let user = await prisma.user.findUnique({
      where: { id: uid }
    });

    if (!user) {
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
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}