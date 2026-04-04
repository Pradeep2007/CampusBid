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
            subject: `🎉 You won the auction for ${item.title}!`,
            text: `Congratulations! You won ${item.title} for ₹${finalPrice}.\n\n--- NEXT STEPS ---\n1. Contact the seller, ${seller.name}, at ${seller.email} or call/WhatsApp them at ${seller.phone} to arrange a meetup.\n2. Bring exact cash or have your payment app ready.\n3. Ask the seller for their 4-digit Meetup Code to unlock the item inspection.\n\nStay safe!`
          });

          await sendEmail({
            to: seller.email,
            subject: `🤝 Your item ${item.title} has sold!`,
            text: `Great news! ${buyer.name} won your auction for ₹${finalPrice}.\n\n--- NEXT STEPS ---\n1. Contact the buyer at ${buyer.email} or call/WhatsApp them at ${buyer.phone} to arrange a meetup.\n2. Bring the item in the condition described.\n3. CRITICAL: Give the buyer this exact Meetup Code so they can verify the handover: ${meetupCode}\n\nStay safe!`
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