import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/emailService.js';

const COLLEGE_DOMAIN = process.env.COLLEGE_DOMAIN || 'stu.manit.ac.in';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const requestOTP = async (req, res) => {
  // Trim and lowercase to prevent bypass with spaces or caps
  const email = req.body.email?.trim().toLowerCase();

  try {
    // 1. Strict Domain Check (Fake Email Detection Layer 1)
    if (!email || !email.endsWith(`@${COLLEGE_DOMAIN}`)) {
      return res.status(403).json({
        message: `Please provide your official @${COLLEGE_DOMAIN} email address.`,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists. Please login.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Updated with returnDocument to fix Mongoose warning
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, returnDocument: 'after' }
    );

    // 2. Email Delivery (Fake Email Detection Layer 2)
    try {
      await sendEmail({
        to: email,
        subject: 'CampusBids Verification Code',
        text: `Your verification code is: ${otp}. It expires in 5 minutes.`,
      });
      
      return res.status(200).json({ message: 'OTP sent to your official mail.' });
    } catch (mailError) {
      // Triggers if the email address is invalid/fake and rejected by the mail server
      return res.status(400).json({ 
        message: 'Email delivery failed. Please ensure this is a valid, active official MANIT ID.' 
      });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  const { name, password, otp } = req.body;
  const email = req.body.email?.trim().toLowerCase();

  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        creditScore: user.creditScore,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { password } = req.body;
  const email = req.body.email?.trim().toLowerCase();

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.isBanned || user.creditScore < 50) {
        if (!user.isBanned) {
          user.isBanned = true;
          await user.save();
        }
        return res.status(403).json({
          message: 'Account suspended due to low credit score or policy violation.',
        });
      }

      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          creditScore: user.creditScore,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};