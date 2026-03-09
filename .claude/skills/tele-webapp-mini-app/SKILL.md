---
name: tele-webapp-mini-app
description: Xây dựng Telegram Mini App (WebApp) - giao diện web nhúng trong Telegram. Kích hoạt khi user yêu cầu tạo Mini App, WebApp, giao diện web trong Telegram, hoặc tính năng nâng cao cần UI phức tạp.
---

# Telegram Mini App / WebApp - Expert Skill

## Khi nào dùng Mini App

- UI phức tạp mà inline keyboard không đáp ứng được (form nhiều field, gallery, dashboard)
- Cần input phức tạp (date picker, color picker, file upload)
- Hiển thị dữ liệu dạng bảng, biểu đồ

## File structure

```
webapp/
  index.html        → Entry point
  css/style.css     → Styling (dùng Telegram theme vars)
  js/app.js         → Logic
  js/telegram.js    → Telegram WebApp SDK wrapper
```

## Setup

```javascript
// Nút mở Mini App
{
  text: '🌐 Mở Cửa Hàng',
  web_app: { url: process.env.WEBAPP_URL }
}

// Hoặc qua MenuButton
bot.setChatMenuButton({
  chat_id: chatId,
  menu_button: {
    type: 'web_app',
    text: '🛒 Store',
    web_app: { url: process.env.WEBAPP_URL }
  }
});
```

## Telegram Theme Variables (CSS)

```css
/* Tự động match theme Telegram của user */
body {
  background: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}
button {
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
}
a { color: var(--tg-theme-link-color); }
```

## Gửi data về bot

```javascript
// Trong Mini App
const tg = window.Telegram.WebApp;
tg.ready();

// Gửi data khi user hoàn tất
tg.sendData(JSON.stringify({ action: 'buy', productId: '123', qty: 2 }));

// Bot nhận trong handler
bot.on('web_app_data', (msg) => {
  const data = JSON.parse(msg.web_app_data.data);
  // Xử lý đơn hàng...
});
```

## Yêu cầu

- HTTPS bắt buộc (dùng ngrok hoặc Cloudflare Tunnel khi dev)
- Responsive design (chạy trong iframe nhỏ trên mobile)
- Luôn gọi `Telegram.WebApp.ready()` khi load xong
