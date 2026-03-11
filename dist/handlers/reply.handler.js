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
// Xử lý reply keyboard buttons (text messages)
bot_1.default.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text || text.startsWith('/'))
        return;
    const user = await user_service_1.userService.getUser(chatId);
    const lang = user?.lang || 'vi';
    switch (text) {
        case '📦 Gói':
            bot_1.default.sendMessage(chatId, (0, locales_1.t)(lang, 'menu.packages'), {
                parse_mode: 'Markdown',
                ...kb.getToolMenu(lang),
            });
            break;
        case '💰 Nạp tiền':
            bot_1.default.sendMessage(chatId, (0, locales_1.t)(lang, 'menu.topup'), {
                parse_mode: 'Markdown',
                ...kb.getTopupMenu(lang),
            });
            break;
        case '🆘 Hỗ trợ':
            bot_1.default.sendMessage(chatId, (0, locales_1.t)(lang, 'menu.support', { admin: 'your_admin' }), {
                parse_mode: 'Markdown',
            });
            break;
    }
});
