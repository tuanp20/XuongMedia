import TelegramBot from 'node-telegram-bot-api';
import config from './config';

const bot = new TelegramBot(config.bot.token, { polling: config.bot.polling });

export default bot;
