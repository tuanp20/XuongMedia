import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  chatId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  balance: number;
  lang: string;
  referredBy?: number;
  referralCount: number;
  referralEarnings: number;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  chatId: { type: Number, required: true, unique: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  balance: { type: Number, default: 0 },
  lang: { type: String, default: 'vi' },
  referredBy: { type: Number },
  referralCount: { type: Number, default: 0 },
  referralEarnings: { type: Number, default: 0 },
  state: { type: String, default: 'idle' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(this: IUser) {
  this.updatedAt = new Date();
});

export default mongoose.model<IUser>('User', userSchema);
