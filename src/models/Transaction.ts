import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  chatId: number;
  type: 'topup' | 'purchase' | 'referral';
  amount: number;
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  chatId: { type: Number, required: true },
  type: { type: String, enum: ['topup', 'purchase', 'referral'], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
