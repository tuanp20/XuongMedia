"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    bot: {
        token: process.env.TOKEN_BOT || '',
        polling: true,
    },
    admin: {
        ids: process.env.ADMIN_IDS?.split(',').map(Number) || [],
    },
    payment: {
        bank: {
            name: process.env.BANK_NAME || 'MBBank',
            account: process.env.BANK_ACCOUNT || '',
            holder: process.env.BANK_HOLDER || '',
        },
        crypto: {
            usdtTrc20: process.env.USDT_TRC20 || '',
        },
    },
    store: {
        currency: 'VNĐ',
        itemsPerPage: 5,
    },
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/xuongmedia',
    },
};
exports.default = config;
