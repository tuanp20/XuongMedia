import TelegramBot from 'node-telegram-bot-api';
import User, { IUser } from '../models/User';
import Transaction from '../models/Transaction';

export const userService = {
  /**
   * Get or create a user by chatId
   */
  getOrCreateUser: async (msg: TelegramBot.Message): Promise<IUser> => {
    const chatId = msg.chat.id;
    let user = await User.findOne({ chatId });

    if (!user) {
      user = await User.create({
        chatId,
        username: msg.chat.username,
        firstName: msg.chat.first_name,
        lastName: msg.chat.last_name,
        balance: 0,
        lang: 'vi'
      });
    }

    return user;
  },

  /**
   * Update user language
   */
  updateLanguage: async (chatId: number, lang: string) => {
    return await User.findOneAndUpdate({ chatId }, { lang }, { new: true });
  },

  /**
   * Update referral info
   */
  addReferral: async (chatId: number, referrerId: number) => {
    const user = await User.findOne({ chatId });
    if (user && !user.referredBy && referrerId !== chatId) {
      await User.updateOne({ chatId }, { referredBy: referrerId });
      // Increment referrer's count
      await User.updateOne({ chatId: referrerId }, { $inc: { referralCount: 1 } });
    }
  },

  /**
   * Check balance and process purchase
   */
  processPurchase: async (chatId: number, amount: number, description: string) => {
    const user = await User.findOne({ chatId });
    if (!user || user.balance < amount) {
      return { success: false, reason: 'insufficient_balance' as const };
    }

    // Deduct balance
    user.balance -= amount;
    await user.save();

    // Log transaction
    await Transaction.create({
      chatId,
      type: 'purchase',
      amount,
      description,
      status: 'completed'
    });

    return { success: true, balance: user.balance };
  },

  /**
   * Get user by chatId
   */
  getUser: async (chatId: number): Promise<IUser | null> => {
    return await User.findOne({ chatId });
  }
};
