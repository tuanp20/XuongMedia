const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const bot = new TelegramBot(config.bot.token, { polling: config.bot.polling });

module.exports = bot;
