---
name: tele-admin-panel
description: Xây dựng admin panel trong Telegram Bot - quản lý user, duyệt đơn, thống kê, broadcast. Kích hoạt khi user yêu cầu tính năng admin, dashboard, thống kê, hoặc quản lý hệ thống.
---

# Telegram Admin Panel - Expert Skill

Bạn là chuyên gia xây dựng hệ thống quản trị trên Telegram Bot.

## File structure

```
src/
  services/admin.service.js      → Logic admin (stats, user mgmt)
  handlers/admin.handler.js      → Command & callback handlers
  keyboards/admin.keyboard.js    → Admin menus
  middlewares/auth.middleware.js  → Kiểm tra quyền admin
  config/admin.config.js         → Danh sách admin IDs
```

## Admin Auth

```javascript
// config/admin.config.js
const ADMIN_IDS = process.env.ADMIN_IDS?.split(',').map(Number) || [];

// middlewares/auth.middleware.js
const isAdmin = (chatId) => ADMIN_IDS.includes(chatId);

const adminOnly = (handler) => (msg, ...args) => {
  if (!isAdmin(msg.chat.id || msg.message?.chat.id)) {
    return; // Silent ignore hoặc gửi "Không có quyền"
  }
  return handler(msg, ...args);
};
```

## Admin Commands

| Command | Chức năng |
|---------|-----------|
| `/admin` | Mở admin panel |
| `/stats` | Thống kê nhanh |
| `/broadcast {message}` | Gửi tin nhắn tới tất cả user |
| `/ban {userId}` | Cấm user |
| `/addbal {userId} {amount}` | Cộng số dư |

## Admin Menu Flow

```
/admin → Admin Panel
  ├─ 📊 Thống kê → Users / Revenue / Orders today
  ├─ 👥 Quản lý User → Search / List / Ban
  ├─ 📦 Quản lý Đơn → Pending / Approve / Reject
  ├─ 💰 Duyệt Nạp Tiền → Pending deposits
  ├─ 📢 Broadcast → Gửi tin hàng loạt
  └─ ⚙️ Cài đặt → Prices / Config
```

## Stats Format

```
📊 *Thống kê hệ thống*

👥 Tổng user: {totalUsers}
🆕 Hôm nay: +{newToday}
💰 Doanh thu tháng: {monthRevenue}đ
📦 Đơn hàng hôm nay: {ordersToday}
⏳ Đơn chờ duyệt: {pendingOrders}
💳 Nạp tiền chờ: {pendingDeposits}
```

## Broadcast Pattern

```javascript
// Gửi hàng loạt với delay tránh rate limit
const broadcast = async (bot, userIds, message) => {
  let sent = 0, failed = 0;
  for (const id of userIds) {
    try {
      await bot.sendMessage(id, message, { parse_mode: 'Markdown' });
      sent++;
    } catch {
      failed++;
    }
    // Telegram rate limit: 30 msg/second
    if (sent % 25 === 0) await sleep(1000);
  }
  return { sent, failed };
};
```
