---
name: tele-user-system
description: Quản lý hệ thống user cho Telegram Bot - đăng ký, profile, số dư, lịch sử, referral. Kích hoạt khi user yêu cầu tính năng profile, quản lý người dùng, referral, hoặc hệ thống tài khoản.
---

# Telegram User System - Expert Skill

Bạn là chuyên gia xây dựng hệ thống user trên Telegram Bot, tối ưu cho việc quản lý khách hàng và kiếm tiền.

## File structure

```
src/
  services/user.service.js       → CRUD user, balance, referral logic
  handlers/profile.handler.js    → Xử lý callback profile
  handlers/referral.handler.js   → Xử lý referral
  keyboards/profile.keyboard.js  → Menu profile
  models/user.model.js           → Schema user
```

## User Model

```javascript
const userSchema = {
  chatId: Number,           // Telegram chat ID (unique)
  username: String,         // @username
  firstName: String,
  lastName: String,
  lang: 'vi' | 'en',       // Ngôn ngữ
  balance: Number,          // Số dư (VNĐ)
  totalSpent: Number,       // Tổng chi tiêu
  totalDeposit: Number,     // Tổng nạp
  referralCode: String,     // Mã giới thiệu unique
  referredBy: Number,       // chatId người giới thiệu
  referralCount: Number,    // Số người đã giới thiệu
  referralEarnings: Number, // Tiền thưởng từ referral
  role: 'user' | 'vip' | 'admin',
  createdAt: Date,
  lastActive: Date
};
```

## Auto-register pattern

```javascript
// Middleware: Tự động đăng ký user mới khi /start
const ensureUser = async (chatId, msg) => {
  let user = await getUser(chatId);
  if (!user) {
    user = await createUser({
      chatId,
      username: msg.from.username,
      firstName: msg.from.first_name,
      lastName: msg.from.last_name,
      lang: 'vi',
      balance: 0,
      referralCode: generateReferralCode(chatId),
      role: 'user',
      createdAt: new Date()
    });
  }
  user.lastActive = new Date();
  return user;
};
```

## Referral System

- Link format: `https://t.me/{botUsername}?start=ref_{referralCode}`
- Parse deep link: `/start ref_ABC123` → extract `ABC123`
- Thưởng: Cấu hình % hoa hồng trên mỗi giao dịch của người được giới thiệu
- Anti-fraud: Không tự refer chính mình, giới hạn referral/ngày

## Profile Display

```
👤 *Hồ sơ của bạn*

📛 Tên: {firstName}
🆔 ID: {chatId}
💰 Số dư: {balance}đ
📊 Đã chi: {totalSpent}đ
🤝 Giới thiệu: {referralCount} người
💸 Hoa hồng: {referralEarnings}đ
📅 Tham gia: {createdAt}
```

## Storage

- **MVP**: JSON file hoặc in-memory Map (hiện tại)
- **Production**: MongoDB (mongoose) hoặc SQLite (better-sqlite3)
- Khi chuyển storage, chỉ cần thay service layer, handler không đổi
