
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()

// Token
const bot = new TelegramBot(process.env.TOKEN_BOT, { polling: true });

// === 1. ĐỊNH NGHĨA MENU (CONSTANTS) ===

// Menu Chọn Ngôn Ngữ
const langMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Tiếng Việt 🇻🇳', callback_data: 'set_lang_vi' },
        { text: 'English 🇺🇸', callback_data: 'set_lang_en' }
      ]
    ]
  }
};

// Menu Chính (VI)
const mainMenuVI = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Tool 🛠️', callback_data: 'menu_tool' },
        { text: 'Hồ Sơ 👤', callback_data: 'menu_profile' }
      ],
      [
        { text: 'Nạp tiền 💰', callback_data: 'menu_topup' },
        { text: 'Hướng dẫn 📖', callback_data: 'menu_guide' }
      ],
      [
        { text: 'Giới thiệu bạn bè 🤝', callback_data: 'menu_referral' },
        { text: 'Hỗ trợ 🆘', callback_data: 'menu_support' }
      ]
    ]
  }
};

// Menu Chính (EN)
const mainMenuEN = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Tools 🛠️', callback_data: 'menu_tool' },
        { text: 'Profile 👤', callback_data: 'menu_profile' }
      ],
      [
        { text: 'Top-up 💰', callback_data: 'menu_topup' },
        { text: 'Guide 📖', callback_data: 'menu_guide' }
      ],
      [
        { text: 'Referral 🤝', callback_data: 'menu_referral' },
        { text: 'Support 🆘', callback_data: 'menu_support' }
      ]
    ]
  }
};

// Sub-Menu: Tool (VI)
const toolMenuVI = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Tool Video 🎥', callback_data: 'tool_video' },
        { text: 'Tool Ảnh 🖼️', callback_data: 'tool_image' }
      ],
      [
        { text: 'Other / OpenClaw ⚙️', callback_data: 'tool_other' },
        { text: '🔙 Quay lại', callback_data: 'back_main' }
      ]
    ]
  }
};

// Sub-Menu: Tool (EN)
const toolMenuEN = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Video Tools 🎥', callback_data: 'tool_video' },
        { text: 'Image Tools 🖼️', callback_data: 'tool_image' }
      ],
      [
        { text: 'Other / OpenClaw ⚙️', callback_data: 'tool_other' },
        { text: '🔙 Back', callback_data: 'back_main' }
      ]
    ]
  }
};

// Sub-Menu: Tool Video
const videoToolMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Higg (22k/vid) 💃', callback_data: 'buy_higg' }],
      [{ text: 'Motion Control (15k/vid) 🏃', callback_data: 'buy_motion' }],
      [{ text: '🔙 Back', callback_data: 'menu_tool' }]
    ]
  }
};

// Sub-Menu: Nạp Tiền
const topupMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'VNĐ (MBBank) 🇻🇳', callback_data: 'topup_vnd' },
        { text: 'USDT (Crypto) 💲', callback_data: 'topup_usdt' }
      ],
      [{ text: '🔙 Back', callback_data: 'back_main' }]
    ]
  }
};

// === 2. BIẾN TRẠNG THÁI ===
const userLang = {}; // { chatId: 'vi' }

// === 3. XỬ LÝ LỆNH ===

bot.onText(/\/start/, (msg) => {
  // Khi start, gửi tin nhắn mới (không edit)
  bot.sendMessage(msg.chat.id, '👋 **Xin chào! / Hello!**\n\nVui lòng chọn ngôn ngữ.\nPlease select language.', { 
    parse_mode: 'Markdown', 
    ...langMenu 
  });
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const action = query.data;

  // Lấy ngôn ngữ hiện tại (mặc định VI)
  let lang = userLang[chatId] || 'vi';

  // --- LOGIC XỬ LÝ ---
  try {
    switch (action) {
      // 1. CHỌN NGÔN NGỮ
      case 'set_lang_vi':
        userLang[chatId] = 'vi';
        bot.editMessageText('🏠 **Menu Chính**\nBạn muốn làm gì?', {
          chat_id: chatId, 
          message_id: msgId, 
          parse_mode: 'Markdown',
          reply_markup: mainMenuVI.reply_markup // Truyền rõ ràng reply_markup
        });
        break;

      case 'set_lang_en':
        userLang[chatId] = 'en';
        bot.editMessageText('🏠 **Main Menu**\nWhat do you want to do?', {
          chat_id: chatId, 
          message_id: msgId, 
          parse_mode: 'Markdown',
          reply_markup: mainMenuEN.reply_markup
        });
        break;

      // 2. QUAY LẠI MENU CHÍNH
      case 'back_main':
        if (lang === 'vi') {
          bot.editMessageText('🏠 **Menu Chính**\nBạn muốn làm gì?', { 
            chat_id: chatId, 
            message_id: msgId, 
            parse_mode: 'Markdown', 
            reply_markup: mainMenuVI.reply_markup 
          });
        } else {
          bot.editMessageText('🏠 **Main Menu**\nWhat do you want to do?', { 
            chat_id: chatId, 
            message_id: msgId, 
            parse_mode: 'Markdown', 
            reply_markup: mainMenuEN.reply_markup 
          });
        }
        break;

      // 3. MENU TOOL
      case 'menu_tool':
        if (lang === 'vi') {
          bot.editMessageText('🛠️ **Kho Công Cụ**\nChọn loại tool:', { 
            chat_id: chatId, 
            message_id: msgId, 
            parse_mode: 'Markdown', 
            reply_markup: toolMenuVI.reply_markup 
          });
        } else {
          bot.editMessageText('🛠️ **Tools Hub**\nSelect tool type:', { 
            chat_id: chatId, 
            message_id: msgId, 
            parse_mode: 'Markdown', 
            reply_markup: toolMenuEN.reply_markup 
          });
        }
        break;

      // 4. SUB-MENU: TOOL VIDEO
      case 'tool_video':
        bot.editMessageText('🎥 **Tool Video**\nChọn dịch vụ:', { 
          chat_id: chatId, 
          message_id: msgId, 
          parse_mode: 'Markdown', 
          reply_markup: videoToolMenu.reply_markup 
        });
        break;

      // 5. MENU NẠP TIỀN
      case 'menu_topup':
        bot.editMessageText('💰 **Nạp Tiền / Top-up**', { 
          chat_id: chatId, 
          message_id: msgId, 
          parse_mode: 'Markdown', 
          reply_markup: topupMenu.reply_markup 
        });
        break;

      // 6. CÁC NÚT ACTION
      case 'topup_vnd':
        bot.sendMessage(chatId, `🏦 MBBank: 0123456789\nNội dung: ORDER...`);
        break;

      case 'buy_higg':
        bot.answerCallbackQuery(query.id, { text: '✅ Đã thêm Higg vào giỏ!' });
        break;
        
      case 'menu_profile':
        bot.answerCallbackQuery(query.id, { text: '👤 Profile: Coming soon...' });
        break;

      default:
        bot.answerCallbackQuery(query.id, { text: '🚧 Đang phát triển / Developing...' });
    }
  } catch (error) {
    console.error('Logic Error:', error.message);
  }

  // Luôn phải answer để tắt loading
  bot.answerCallbackQuery(query.id).catch(() => {});
});

bot.on('polling_error', (err) => console.log('Lỗi Polling:', err.message));
console.log('Bot running with EDIT MODE (FIXED)...');
