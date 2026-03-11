"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("../bot"));
const locales_1 = require("../locales");
const kb = __importStar(require("../keyboards/main.keyboard"));
const user_service_1 = require("../services/user.service");
// Helper: edit message với keyboard
const editMsg = (chatId, msgId, lang, textKey, keyboard, params) => {
    bot_1.default.editMessageText((0, locales_1.t)(lang, textKey, params), {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: 'Markdown',
        reply_markup: keyboard.reply_markup,
    });
};
bot_1.default.on('callback_query', async (query) => {
    if (!query.message)
        return;
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const action = query.data;
    if (!action)
        return;
    const user = await user_service_1.userService.getUser(chatId);
    const lang = user?.lang || 'vi';
    // Language selection
    if (action === 'lang:vi' || action === 'lang:en') {
        const newLang = action.split(':')[1];
        await user_service_1.userService.updateLanguage(chatId, newLang);
        editMsg(chatId, msgId, newLang, 'menu.main', kb.getMainMenu(newLang));
        bot_1.default.answerCallbackQuery(query.id);
        return;
    }
    // Menu navigation (prefix: m:)
    if (action.startsWith('m:')) {
        const menu = action.replace('m:', '');
        switch (menu) {
            case 'main':
                editMsg(chatId, msgId, lang, 'menu.main', kb.getMainMenu(lang));
                break;
            case 'tools':
                editMsg(chatId, msgId, lang, 'menu.tools', kb.getToolMenu(lang));
                break;
            case 'tools_video':
                editMsg(chatId, msgId, lang, 'menu.tools_video', kb.getVideoToolMenu(lang));
                break;
            case 'tools_image':
            case 'tools_other':
                bot_1.default.answerCallbackQuery(query.id, { text: (0, locales_1.t)(lang, 'developing') });
                return;
            case 'topup':
                editMsg(chatId, msgId, lang, 'menu.topup', kb.getTopupMenu(lang));
                break;
            case 'profile':
                editMsg(chatId, msgId, lang, 'menu.profile', kb.getMainMenu(lang), {
                    name: query.from.first_name || 'User',
                    chatId,
                    balance: user?.balance || 0,
                    joined: user?.createdAt?.toLocaleDateString('vi-VN') || 'N/A',
                });
                break;
            case 'guide':
                editMsg(chatId, msgId, lang, 'menu.guide', kb.getMainMenu(lang));
                break;
            case 'referral':
                editMsg(chatId, msgId, lang, 'menu.referral', kb.getMainMenu(lang), {
                    link: `https://t.me/${(query.message.chat.username || 'bot')}?start=ref_${chatId}`,
                    count: user?.referralCount || 0,
                    earnings: user?.referralEarnings || 0,
                });
                break;
            case 'support':
                editMsg(chatId, msgId, lang, 'menu.support', kb.getMainMenu(lang), {
                    admin: 'your_admin',
                });
                break;
            default:
                bot_1.default.answerCallbackQuery(query.id, { text: (0, locales_1.t)(lang, 'developing') });
                return;
        }
        bot_1.default.answerCallbackQuery(query.id);
        return;
    }
    // Payment (prefix: pay:)
    if (action.startsWith('pay:')) {
        const method = action.replace('pay:', '');
        if (method === 'vnd') {
            bot_1.default.sendMessage(chatId, '🏦 MBBank: 0123456789\nNội dung: NAP ' + chatId);
        }
        else {
            bot_1.default.answerCallbackQuery(query.id, { text: (0, locales_1.t)(lang, 'developing') });
            return;
        }
        bot_1.default.answerCallbackQuery(query.id);
        return;
    }
    // Store (prefix: s:)
    if (action.startsWith('s:')) {
        const buyAction = action.replace('s:buy:', '');
        let price = 0;
        let itemName = '';
        if (buyAction === 'higg') {
            price = 22000;
            itemName = 'Higg Video';
        }
        else if (buyAction === 'motion') {
            price = 15000;
            itemName = 'Motion Control Video';
        }
        if (price > 0) {
            const result = await user_service_1.userService.processPurchase(chatId, price, `Mua ${itemName}`);
            if (result.success) {
                bot_1.default.answerCallbackQuery(query.id, { text: `✅ Mua thành công! Số dư: ${result.balance}đ` });
            }
            else {
                bot_1.default.answerCallbackQuery(query.id, { text: `❌ Số dư không đủ! Cần ${price}đ`, show_alert: true });
                bot_1.default.sendMessage(chatId, (0, locales_1.t)(lang, 'menu.topup'), kb.getTopupMenu(lang));
            }
        }
        else {
            bot_1.default.answerCallbackQuery(query.id, { text: '✅ Đã thêm vào giỏ!' });
        }
        return;
    }
    // Fallback
    bot_1.default.answerCallbackQuery(query.id, { text: (0, locales_1.t)(lang, 'developing') });
});
