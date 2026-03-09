---
name: tele-i18n-engine
description: Hệ thống đa ngôn ngữ cho Telegram Bot - quản lý bản dịch, auto-detect ngôn ngữ, chuyển đổi linh hoạt. Kích hoạt khi user yêu cầu thêm ngôn ngữ, dịch nội dung, hoặc quản lý i18n.
---

# Telegram i18n Engine - Expert Skill

## File structure

```
src/
  locales/
    vi.json    → Bản dịch tiếng Việt
    en.json    → Bản dịch tiếng Anh
    index.js   → i18n loader & helper
```

## Pattern

```javascript
// src/locales/index.js
const vi = require('./vi.json');
const en = require('./en.json');

const locales = { vi, en };

const t = (lang, key, params = {}) => {
  let text = locales[lang]?.[key] || locales['vi'][key] || key;
  // Replace {param} placeholders
  Object.entries(params).forEach(([k, v]) => {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  });
  return text;
};

module.exports = { t };
```

## Locale file format

```json
// vi.json
{
  "menu.main": "🏠 *Menu Chính*\nBạn muốn làm gì?",
  "menu.tools": "🛠️ *Kho Công Cụ*\nChọn loại tool:",
  "menu.topup": "💰 *Nạp Tiền*\nChọn phương thức:",
  "profile.title": "👤 *Hồ sơ của bạn*",
  "profile.balance": "💰 Số dư: {balance}đ",
  "btn.back": "🔙 Quay lại",
  "btn.tools": "Tool 🛠️",
  "btn.profile": "Hồ Sơ 👤",
  "deposit.success": "✅ Nạp thành công {amount}đ!",
  "error.generic": "❌ Đã xảy ra lỗi, vui lòng thử lại."
}
```

## Cách sử dụng trong handler

```javascript
const { t } = require('../locales');

// Trong handler
const lang = user.lang || 'vi';
bot.editMessageText(t(lang, 'menu.main'), {
  chat_id: chatId,
  message_id: msgId,
  parse_mode: 'Markdown',
  reply_markup: getMainMenu(lang)
});
```

## Quy tắc

- Key dùng dot notation: `section.subsection.key`
- Mọi text hiển thị cho user PHẢI qua hàm `t()`
- Khi thêm text mới: thêm cả vi.json và en.json cùng lúc
- Emoji nằm trong bản dịch, không hardcode trong handler
