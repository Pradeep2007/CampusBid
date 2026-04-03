import express from 'express';
import { verifyMeetupCode, completeHandshake } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/verify-code', protect, verifyMeetupCode);
router.post('/complete', protect, completeHandshake);

export default router;