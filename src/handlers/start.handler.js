const bot = require('../bot');
const { t } = require('../locales');
const { getSession, setSession } = require('../middlewares/session');
const { getLangMenu, getMainMenu, getReplyKeyboard } = require('../keyboards/main.keyboard');

bot.onText(/\/start(.*)/, (msg, match) => {
  const chatId = msg.chat.id;
  const param = match[1]?.trim(); // Deep link parameter (e.g., ref_ABC123)

  // Lưu referral nếu có
  if (param && param.startsWith('ref_')) {
    const refCode = param.replace('ref_', '');
    setSession(chatId, { referredBy: refCode });
  }

  // Gửi reply keyboard cố định
  bot.sendMessage(chatId, t(getSession(chatId).lang, 'keyboard.ready'), getReplyKeyboard());

  // Gửi menu chọn ngôn ngữ
  bot.sendMessage(chatId, t('vi', 'select_lang'), {
    parse_mode: 'Markdown',
    ...getLangMenu(),
  });
});

module.exports = {};
