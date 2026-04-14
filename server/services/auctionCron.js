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
            subject: `CampusBids Notice: Action required for ${item.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.5;">
                <p>This is an automated notice that your bid for <strong>${item.title}</strong> was successful.</p>
                <p><strong>Final Amount:</strong> Rs. ${finalPrice}<br/>
                <strong>Seller:</strong> ${seller.name}</p>
                <p><strong>Contact Seller:</strong><br/>
                Email: <a href="mailto:${seller.email}" style="color: #2563eb;">${seller.email}</a><br/>
                Phone: <a href="tel:${seller.phone}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">${seller.phone}</a></p>
                <p>Please contact the student to arrange the handover. Provide them with your 4-digit verification code to complete the process.</p>
                <p>Regards,<br/>CampusBids System</p>
              </div>
            `
          });

          await sendEmail({
            to: seller.email,
            subject: `CampusBids Notice: Status update for ${item.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.5;">
                <p>This is an automated notice that your listing for <strong>${item.title}</strong> has concluded successfully.</p>
                <p><strong>Buyer:</strong> ${buyer.name}</p>
                <p><strong>Contact Buyer:</strong><br/>
                Email: <a href="mailto:${buyer.email}" style="color: #2563eb;">${buyer.email}</a><br/>
                Phone: <a href="tel:${buyer.phone}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">${buyer.phone}</a></p>
                <p>Please contact the student to arrange the handover. Collect their 4-digit verification code to verify the transaction: <strong>${meetupCode}</strong></p>
                <p>Regards,<br/>CampusBids System</p>
              </div>
            `
          });

        } else {
          item.status = 'Expired_Unsold';
          await item.save();

          const highPriceCount = item.feedback ? item.feedback.filter(f => f.trim().toLowerCase() === 'high price').length : 0;
          const lowDemandCount = item.feedback ? item.feedback.filter(f => f.trim().toLowerCase() === 'low demand').length : 0;

          let htmlFeedback = `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.5;">
              <p>This is an automated notice regarding your listing: <strong>${item.title}</strong>.</p>
              <p>The listing period has concluded without any active bids.</p>
          `;

          if (highPriceCount > 0 || lowDemandCount > 0) {
            htmlFeedback += `
              <p><strong>Market Data Summary:</strong></p>
              <ul>
                <li>Marked as 'Price Too High': <strong>${highPriceCount} users</strong></li>
                <li>Marked as 'Low Demand': <strong>${lowDemandCount} users</strong></li>
              </ul>
              <p>You may adjust your listing details based on this data before reposting.</p>
            `;
          } else {
            htmlFeedback += `<p>No market data was collected for this listing. You may repost the item at your convenience.</p>`;
          }

          htmlFeedback += `<p>Regards,<br/>CampusBids System</p></div>`;

          await sendEmail({
            to: item.seller.email,
            subject: `CampusBids Notice: Listing expired for ${item.title}`,
            html: htmlFeedback
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
};