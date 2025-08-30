import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import bidRoutes from './routes/bids.js';
import paymentRoutes from './routes/payments.js';
import groupRoutes from './routes/groups.js';
import userRoutes from './routes/users.js';
import submissionRoutes from './routes/submissions.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://your-vercel-app.vercel.app"] 
      : ["http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

const prisma = new PrismaClient();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://your-vercel-app.vercel.app"] 
    : ["http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/submissions', submissionRoutes);

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-task', (taskId) => {
    socket.join(`task-${taskId}`);
  });

  socket.on('send-message', (data) => {
    io.to(`task-${data.taskId}`).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});