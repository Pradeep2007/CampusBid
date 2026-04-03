import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { startCronJobs } from './services/auctionCron.js';
import socketHandler from './sockets/bidHandler.js';
import { sendEmail } from './utils/emailService.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.get('/', (req, res) => {
  res.send('CampusBid API is live and running...');
});

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/transactions', transactionRoutes);

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `SUPPORT TICKET: ${subject}`,
      text: `Name: ${name}\nStudent Email: ${email}\n\nMessage:\n${message}`
    });
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email' });
  }
});

socketHandler(io);
startCronJobs();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});