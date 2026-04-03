import express from 'express';
import { requestOTP, registerUser, loginUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request-otp', requestOTP);
router.post('/signup', registerUser);
router.post('/login', loginUser);

router.get('/profile', protect, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    creditScore: req.user.creditScore,
  });
});

export default router;