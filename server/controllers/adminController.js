import User from '../models/User.js';
import Item from '../models/Item.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const activeAuctions = await Item.countDocuments({ status: 'Active' });
    
    const reportedItems = await Item.find({ 'feedback.tooExpensiveCount': { $gt: 5 } })
      .select('title feedback currentPrice')
      .limit(5);

    res.json({ totalUsers, totalItems, activeAuctions, reportedItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};