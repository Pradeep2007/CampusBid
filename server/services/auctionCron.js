import cron from 'node-cron';
import Item from '../models/Item.js';
import Transaction from '../models/Transaction.js';
import { sendEmail } from '../utils/emailService.js';

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export const startCronJobs = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      const expiredItems = await Item.find({
        endTime: { $lte: now },
        status: 'Active'
      }).populate('seller').populate('bids.bidder');

      for (const item of expiredItems) {
        if (item.bids.length > 0) {
          const winningBid = item.bids.sort((a, b) => b.amount - a.amount)[0];
          const buyer = winningBid.bidder;
          const seller = item.seller;
          const finalPrice = winningBid.amount;
          const meetupCode = generateOTP();

          await Transaction.create({
            item: item._id,
            buyer: buyer._id,
            seller: seller._id,
            finalPrice,
            meetupCode
          });

          item.status = 'Pending_Meetup';
          await item.save();

          await sendEmail({
            to: buyer.email,
            subject: `You won the auction for ${item.title}!`,
            text: `Congratulations! You won ${item.title} for ₹${finalPrice}. Please meet the seller, ${seller.name}, on campus. Ask them for the 4-digit meetup code to unlock the inspection on your app.`
          });

          await sendEmail({
            to: seller.email,
            subject: `Your item ${item.title} has sold!`,
            text: `Great news! ${buyer.name} bought your item for ₹${finalPrice}. Please arrange a meetup. CRITICAL: When you meet, give the buyer this code to verify the handover: ${meetupCode}`
          });

        } else {
          item.status = 'Expired_Unsold';
          await item.save();
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
};
