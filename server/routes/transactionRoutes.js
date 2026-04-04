import express from 'express';
import { verifyMeetupCode, completeHandshake, reportBuyerAndCancel } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/verify-code', protect, verifyMeetupCode);
router.post('/complete', protect, completeHandshake);
router.post('/report-buyer', protect, reportBuyerAndCancel);

export default router;