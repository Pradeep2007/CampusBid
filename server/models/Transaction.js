import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    finalPrice: { type: Number, required: true },
    meetupCode: { type: String, required: true },
    codeVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Disputed', 'Disputed_No_Code'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);