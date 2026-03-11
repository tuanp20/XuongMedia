"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const config_1 = __importDefault(require("./config"));
const bot = new node_telegram_bot_api_1.default(config_1.default.bot.token, { polling: config_1.default.bot.polling });
exports.default = bot;
