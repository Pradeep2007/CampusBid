import Transaction from '../models/Transaction.js';
import Item from '../models/Item.js';
import User from '../models/User.js';

export const verifyMeetupCode = async (req, res) => {
  const { transactionId, code } = req.body;

  try {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the buyer can verify this code' });
    }

    if (transaction.meetupCode !== code) {
      return res.status(400).json({ message: 'Invalid meetup code' });
    }

    transaction.codeVerified = true;
    await transaction.save();

    res.json({ message: 'Code verified successfully. You may now inspect the item.', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeHandshake = async (req, res) => {
  const { transactionId, action } = req.body; 

  try {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction || !transaction.codeVerified) {
      return res.status(400).json({ message: 'Transaction invalid or code not verified yet' });
    }

    const item = await Item.findById(transaction.item);
    const seller = await User.findById(transaction.seller);
    const buyer = await User.findById(transaction.buyer);

    if (action === 'Accept') {
      transaction.status = 'Completed';
      item.status = 'Sold';
      seller.creditScore += 5;
      buyer.creditScore += 5;

      await transaction.save();
      await item.save();
      await seller.save();
      await buyer.save();

      res.json({ message: 'Transaction completed successfully', item, sellerCredit: seller.creditScore });

    } else if (action === 'Reject') {
      item.rejectionCount += 1;
      
      if (item.rejectionCount >= 3) {
        item.status = 'Blacklisted';
      } else {
        item.status = 'Expired_Unsold'; 
      }

      transaction.status = 'Disputed'; 
      
      await item.save();
      await transaction.save();

      res.json({ message: 'Item rejected and recorded', itemStatus: item.status });
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};