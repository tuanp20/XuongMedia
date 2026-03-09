const bot = require('../bot');
const { t } = require('../locales');
const { getSession } = require('../middlewares/session');
const kb = require('../keyboards/main.keyboard');

// Xử lý reply keyboard buttons (text messages)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/')) return;

  const lang = getSession(chatId).lang || 'vi';

  switch (text) {
    case '📦 Gói':
      bot.sendMessage(chatId, t(lang, 'menu.packages'), {
        parse_mode: 'Markdown',
        ...kb.getToolMenu(lang),
      });
      break;

    case '💰 Nạp tiền':
      bot.sendMessage(chatId, t(lang, 'menu.topup'), {
        parse_mode: 'Markdown',
        ...kb.getTopupMenu(lang),
      });
      break;

    case '🆘 Hỗ trợ':
      bot.sendMessage(chatId, t(lang, 'menu.support', { admin: 'your_admin' }), {
        parse_mode: 'Markdown',
      });
      break;
  }
});

module.exports = {};
