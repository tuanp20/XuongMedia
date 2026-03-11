"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const User_1 = __importDefault(require("../models/User"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
exports.userService = {
    /**
     * Get or create a user by chatId
     */
    getOrCreateUser: async (msg) => {
        const chatId = msg.chat.id;
        let user = await User_1.default.findOne({ chatId });
        if (!user) {
            user = await User_1.default.create({
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
    updateLanguage: async (chatId, lang) => {
        return await User_1.default.findOneAndUpdate({ chatId }, { lang }, { new: true });
    },
    /**
     * Update referral info
     */
    addReferral: async (chatId, referrerId) => {
        const user = await User_1.default.findOne({ chatId });
        if (user && !user.referredBy && referrerId !== chatId) {
            await User_1.default.updateOne({ chatId }, { referredBy: referrerId });
            // Increment referrer's count
            await User_1.default.updateOne({ chatId: referrerId }, { $inc: { referralCount: 1 } });
        }
    },
    /**
     * Check balance and process purchase
     */
    processPurchase: async (chatId, amount, description) => {
        const user = await User_1.default.findOne({ chatId });
        if (!user || user.balance < amount) {
            return { success: false, reason: 'insufficient_balance' };
        }
        // Deduct balance
        user.balance -= amount;
        await user.save();
        // Log transaction
        await Transaction_1.default.create({
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
    getUser: async (chatId) => {
        return await User_1.default.findOne({ chatId });
    }
};
