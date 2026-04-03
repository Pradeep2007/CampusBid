import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: ['Textbooks', 'Electronics', 'Furniture', 'Lab Equipment', 'Stationery', 'Other'],
      default: 'Other'
    },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Active', 'Expired_Unsold', 'Pending_Meetup', 'Sold', 'Blacklisted'],
      default: 'Active'
    },
    bids: [
      {
        bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: { type: Number },
        time: { type: Date, default: Date.now }
      }
    ],
    feedback: {
      tooExpensiveCount: { type: Number, default: 0 },
      notNeededCount: { type: Number, default: 0 },
      votedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    rejectionCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Item', itemSchema);