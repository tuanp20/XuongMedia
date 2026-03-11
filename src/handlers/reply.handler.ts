import bot from '../bot';
import { t } from '../locales';
import * as kb from '../keyboards/main.keyboard';
import { userService } from '../services/user.service';
import TelegramBot from 'node-telegram-bot-api';

// Xử lý reply keyboard buttons (text messages)
bot.on('message', async (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/')) return;

  const user = await userService.getUser(chatId);
  const lang = user?.lang || 'vi';

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
