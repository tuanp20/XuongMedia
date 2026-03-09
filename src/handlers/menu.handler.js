const bot = require('../bot');
const { t } = require('../locales');
const { getSession, setSession } = require('../middlewares/session');
const kb = require('../keyboards/main.keyboard');

// Helper: edit message với keyboard
const editMsg = (chatId, msgId, lang, textKey, keyboard, params) => {
  bot.editMessageText(t(lang, textKey, params), {
    chat_id: chatId,
    message_id: msgId,
    parse_mode: 'Markdown',
    reply_markup: keyboard.reply_markup,
  });
};

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const action = query.data;
  const session = getSession(chatId);
  const lang = session.lang || 'vi';

  // Language selection
  if (action === 'lang:vi' || action === 'lang:en') {
    const newLang = action.split(':')[1];
    setSession(chatId, { lang: newLang });
    editMsg(chatId, msgId, newLang, 'menu.main', kb.getMainMenu(newLang));
    bot.answerCallbackQuery(query.id);
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
        bot.answerCallbackQuery(query.id, { text: t(lang, 'developing') });
        return;
      case 'topup':
        editMsg(chatId, msgId, lang, 'menu.topup', kb.getTopupMenu(lang));
        break;
      case 'profile':
        editMsg(chatId, msgId, lang, 'menu.profile', kb.getMainMenu(lang), {
          name: query.from.first_name || 'User',
          chatId,
          balance: session.balance || 0,
          joined: session.createdAt || 'N/A',
        });
        break;
      case 'guide':
        editMsg(chatId, msgId, lang, 'menu.guide', kb.getMainMenu(lang));
        break;
      case 'referral':
        editMsg(chatId, msgId, lang, 'menu.referral', kb.getMainMenu(lang), {
          link: `https://t.me/${(query.message.chat.username || 'bot')}?start=ref_${chatId}`,
          count: session.referralCount || 0,
          earnings: session.referralEarnings || 0,
        });
        break;
      case 'support':
        editMsg(chatId, msgId, lang, 'menu.support', kb.getMainMenu(lang), {
          admin: 'your_admin',
        });
        break;
      default:
        bot.answerCallbackQuery(query.id, { text: t(lang, 'developing') });
        return;
    }

    bot.answerCallbackQuery(query.id);
    return;
  }

  // Payment (prefix: pay:)
  if (action.startsWith('pay:')) {
    const method = action.replace('pay:', '');
    if (method === 'vnd') {
      bot.sendMessage(chatId, '🏦 MBBank: 0123456789\nNội dung: NAP ' + chatId);
    } else {
      bot.answerCallbackQuery(query.id, { text: t(lang, 'developing') });
      return;
    }
    bot.answerCallbackQuery(query.id);
    return;
  }

  // Store (prefix: s:)
  if (action.startsWith('s:')) {
    bot.answerCallbackQuery(query.id, { text: '✅ Đã thêm vào giỏ!' });
    return;
  }

  // Fallback
  bot.answerCallbackQuery(query.id, { text: t(lang, 'developing') });
});

module.exports = {};
