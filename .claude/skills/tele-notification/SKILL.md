---
name: tele-notification
description: Hệ thống thông báo cho Telegram Bot - gửi tin nhắn tự động, scheduled messages, welcome flow, reminder. Kích hoạt khi user yêu cầu gửi thông báo, tự động nhắn tin, lên lịch, hoặc welcome message.
---

# Telegram Notification System - Expert Skill

## File structure

```
src/
  services/notification.service.js → Logic gửi thông báo
  services/scheduler.service.js    → Lên lịch (node-cron)
  handlers/notification.handler.js → Xử lý callback
```

## Loại thông báo

### 1. Transactional
- Nạp tiền thành công/thất bại
- Đơn hàng cập nhật trạng thái
- Sản phẩm sẵn sàng/hết hàng

### 2. Welcome Flow
```
Đăng ký → Chào mừng (ngay)
        → Hướng dẫn sử dụng (sau 5 phút)
        → Gợi ý sản phẩm hot (sau 1 giờ)
        → Nhắc nạp tiền (sau 24 giờ nếu balance = 0)
```

### 3. Broadcast (Admin)
- Gửi tới tất cả user hoặc segment
- Hỗ trợ text, ảnh, video
- Rate limit: 30 msg/s (Telegram limit)

### 4. Scheduled
- Dùng `node-cron` cho recurring tasks
- Nhắc nhở, khuyến mãi định kỳ

## Notification Template

```javascript
const templates = {
  deposit_success: (amount) =>
    `✅ *Nạp tiền thành công!*\n\n💰 Số tiền: ${amount.toLocaleString()}đ\n💳 Số dư mới: {newBalance}đ`,

  order_completed: (order) =>
    `📦 *Đơn hàng hoàn tất!*\n\n🔢 Mã: \`${order.id}\`\n📋 ${order.product}\n\nCảm ơn bạn đã sử dụng dịch vụ!`,

  welcome: (name) =>
    `👋 Chào mừng *${name}*!\n\nBạn đã sẵn sàng khám phá các công cụ tuyệt vời 🚀`,
};
```

## Anti-spam

- Không gửi quá 1 broadcast/ngày cho mỗi user
- Cho phép user tắt thông báo: callback `notif:off`
- Ghi log mỗi notification đã gửi
