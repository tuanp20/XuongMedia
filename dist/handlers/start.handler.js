"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("../bot"));
const locales_1 = require("../locales");
const main_keyboard_1 = require("../keyboards/main.keyboard");
const user_service_1 = require("../services/user.service");
bot_1.default.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const param = match?.[1]?.trim(); // Deep link parameter (e.g., ref_123456)
    // Initialize or get user from DB
    let user = await user_service_1.userService.getOrCreateUser(msg);
    // Handle referral logic
    if (param && param.startsWith('ref_')) {
        const referrerId = parseInt(param.replace('ref_', ''));
        if (!isNaN(referrerId)) {
            await user_service_1.userService.addReferral(chatId, referrerId);
        }
    }
    const lang = user.lang || 'vi';
    // Gửi reply keyboard cố định
    bot_1.default.sendMessage(chatId, (0, locales_1.t)(lang, 'keyboard.ready'), (0, main_keyboard_1.getReplyKeyboard)());
    // Gửi menu chọn ngôn ngữ
    bot_1.default.sendMessage(chatId, (0, locales_1.t)('vi', 'select_lang'), {
        parse_mode: 'Markdown',
        ...(0, main_keyboard_1.getLangMenu)(),
    });
});
