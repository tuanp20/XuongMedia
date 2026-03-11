import bot from '../bot';
import { t } from '../locales';
import * as kb from '../keyboards/main.keyboard';
import { userService } from '../services/user.service';
import TelegramBot from 'node-telegram-bot-api';

// Helper: edit message với keyboard
const editMsg = (chatId: number, msgId: number, lang: string, textKey: string, keyboard: any, params?: any) => {
  bot.editMessageText(t(lang, textKey, params), {
    chat_id: chatId,
    message_id: msgId,
    parse_mode: 'Markdown',
    reply_markup: keyboard.reply_markup,
  });
};

bot.on('callback_query', async (query: TelegramBot.CallbackQuery) => {
  if (!query.message) return;
  
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const action = query.data;
  
  if (!action) return;

  const user = await userService.getUser(chatId);
  const lang = user?.lang || 'vi';

  // Language selection
  if (action === 'lang:vi' || action === 'lang:en') {
    const newLang = action.split(':')[1];
    await userService.updateLanguage(chatId, newLang);
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
    const buyAction = action.replace('s:buy:', '');
    let price = 0;
    let itemName = '';

    if (buyAction === 'higg') {
      price = 22000;
      itemName = 'Higg Video';
    } else if (buyAction === 'motion') {
      price = 15000;
      itemName = 'Motion Control Video';
    }

    if (price > 0) {
      const result = await userService.processPurchase(chatId, price, `Mua ${itemName}`);
      if (result.success) {
        bot.answerCallbackQuery(query.id, { text: `✅ Mua thành công! Số dư: ${result.balance}đ` });
      } else {
        bot.answerCallbackQuery(query.id, { text: `❌ Số dư không đủ! Cần ${price}đ`, show_alert: true });
        bot.sendMessage(chatId, t(lang, 'menu.topup'), kb.getTopupMenu(lang));
      }
    } else {
      bot.answerCallbackQuery(query.id, { text: '✅ Đã thêm vào giỏ!' });
    }
    return;
  }

  // Fallback
  bot.answerCallbackQuery(query.id, { text: t(lang, 'developing') });
});
