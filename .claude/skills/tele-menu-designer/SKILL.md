---
name: tele-menu-designer
description: Thiết kế menu, keyboard, và navigation flow cho Telegram Bot. Kích hoạt khi user yêu cầu tạo menu mới, thay đổi layout, thêm nút bấm, hoặc thiết kế luồng điều hướng.
---

# Telegram Menu Designer - Expert Skill

Bạn là chuyên gia thiết kế UI/UX trên Telegram, hiểu rõ giới hạn và tận dụng tối đa khả năng của Telegram Bot API.

## Nguyên tắc thiết kế menu

### 1. Inline Keyboard Rules
- Tối đa 8 nút/hàng (nhưng nên 2-3 nút/hàng để dễ bấm trên mobile)
- Tối đa 100 nút/message
- callback_data tối đa 64 bytes - dùng mã ngắn
- Luôn có nút 🔙 Back ở hàng cuối

### 2. Reply Keyboard Rules
- Dùng cho hành động thường xuyên (menu chính cố định)
- `resize_keyboard: true` luôn bật
- `persistent: true` cho menu cố định
- Tối đa 3-4 nút trên hàng đầu, responsive

### 3. Navigation Flow Pattern
```
/start → Language → Main Menu
                      ├─ 🛠️ Tools → Sub-categories → Product → Buy
                      ├─ 👤 Profile → Info / Edit / History
                      ├─ 💰 Top-up → Method → Amount → Confirm
                      ├─ 📖 Guide → FAQ / Tutorial
                      ├─ 🤝 Referral → Link / Stats
                      └─ 🆘 Support → Ticket / Contact
```

### 4. Message Edit Pattern (QUAN TRỌNG)
```javascript
// ĐÚNG: Edit message hiện tại (mượt, không spam)
bot.editMessageText(text, {
  chat_id: chatId,
  message_id: msgId,
  parse_mode: 'Markdown',
  reply_markup: keyboard.reply_markup
});

// SAI: Gửi message mới (spam chat, UX kém)
bot.sendMessage(chatId, text, keyboard);
```

## File structure

```
src/keyboards/
  main.keyboard.js      → Menu chính + language
  store.keyboard.js      → Menu store/catalog
  profile.keyboard.js    → Menu profile
  payment.keyboard.js    → Menu thanh toán
  admin.keyboard.js      → Menu admin
  _builder.js            → Keyboard builder utility
```

## Keyboard Builder Utility

```javascript
// src/keyboards/_builder.js
class KeyboardBuilder {
  constructor() { this.rows = []; }

  row(...buttons) {
    this.rows.push(buttons.map(b =>
      typeof b === 'string' ? { text: b, callback_data: b } : b
    ));
    return this;
  }

  btn(text, data) { return { text, callback_data: data }; }
  url(text, url) { return { text, url }; }
  back(data = 'back_main', text = '🔙') { return this.row({ text, callback_data: data }); }

  build() { return { reply_markup: { inline_keyboard: this.rows } }; }
}

module.exports = { KeyboardBuilder };
```

## Quy ước callback_data

| Prefix | Nghĩa | Ví dụ |
|--------|--------|-------|
| `m:` | Menu navigation | `m:main`, `m:tool` |
| `s:` | Store action | `s:buy:id`, `s:view:id` |
| `p:` | Profile action | `p:edit`, `p:history` |
| `pay:` | Payment | `pay:vnd`, `pay:usdt` |
| `a:` | Admin | `a:users`, `a:stats` |
| `lang:` | Language | `lang:vi`, `lang:en` |
