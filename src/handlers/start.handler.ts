import bot from '../bot';
import { t } from '../locales';
import { getLangMenu, getReplyKeyboard } from '../keyboards/main.keyboard';
import { userService } from '../services/user.service';

bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const param = match?.[1]?.trim(); // Deep link parameter (e.g., ref_123456)

  // Initialize or get user from DB
  let user = await userService.getOrCreateUser(msg);

  // Handle referral logic
  if (param && param.startsWith('ref_')) {
    const referrerId = parseInt(param.replace('ref_', ''));
    if (!isNaN(referrerId)) {
      await userService.addReferral(chatId, referrerId);
    }
  }

  const lang = user.lang || 'vi';

  // Gửi reply keyboard cố định
  bot.sendMessage(chatId, t(lang, 'keyboard.ready'), getReplyKeyboard());

  // Gửi menu chọn ngôn ngữ
  bot.sendMessage(chatId, t('vi', 'select_lang'), {
    parse_mode: 'Markdown',
    ...getLangMenu(),
  });
});
