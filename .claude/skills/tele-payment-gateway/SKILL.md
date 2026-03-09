---
name: tele-payment-gateway
description: Tích hợp thanh toán cho Telegram Bot - VNĐ (ngân hàng), USDT (crypto), Telegram Stars. Kích hoạt khi user yêu cầu tính năng nạp tiền, thanh toán, xác nhận chuyển khoản, hoặc tích hợp cổng thanh toán.
---

# Telegram Payment Gateway - Expert Skill

Bạn là chuyên gia tích hợp thanh toán trên Telegram, am hiểu cả hệ thống ngân hàng VN và crypto.

## Phương thức thanh toán hỗ trợ

### 1. VNĐ - Chuyển khoản ngân hàng
- Tạo mã QR VietQR tự động (API: `https://img.vietqr.io/image/{bank}-{account}-{template}.png?amount={amount}&addInfo={content}`)
- Nội dung chuyển khoản: `NAP {userId} {orderId}`
- Xác nhận thủ công (admin) hoặc tự động qua webhook bank

### 2. USDT - Crypto
- Hiển thị địa chỉ ví + QR code
- Hỗ trợ mạng: TRC20 (phí thấp), ERC20, BEP20
- Kiểm tra giao dịch qua blockchain API

### 3. Telegram Stars (Built-in)
- Sử dụng `sendInvoice` API của Telegram
- Không cần bên thứ ba
- Telegram lấy 30% phí

## File structure

```
src/
  services/payment.service.js   → Logic thanh toán, tạo mã, xác nhận
  handlers/payment.handler.js   → Xử lý callback thanh toán
  keyboards/payment.keyboard.js → Menu chọn phương thức
  config/payment.config.js      → Bank info, wallet addresses, API keys
```

## Payment Flow

```
User chọn Nạp tiền
  → Chọn phương thức (VNĐ / USDT / Stars)
  → Nhập số tiền (preset buttons: 50k, 100k, 200k, 500k, custom)
  → Hiển thị thông tin chuyển khoản + QR
  → User chuyển khoản
  → Xác nhận (auto/manual)
  → Cộng số dư → Thông báo
```

## Patterns

```javascript
// Tạo QR VietQR
const generateVietQR = (bankId, account, amount, content) => {
  return `https://img.vietqr.io/image/${bankId}-${account}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}`;
};

// Gửi ảnh QR trong Telegram
bot.sendPhoto(chatId, qrUrl, {
  caption: `💰 *Nạp ${amount.toLocaleString()}đ*\n\n🏦 Ngân hàng: MBBank\n📋 STK: 0123456789\n📝 Nội dung: \`${content}\`\n\n⏰ Chuyển khoản trong 15 phút`,
  parse_mode: 'Markdown',
  reply_markup: {
    inline_keyboard: [
      [{ text: '✅ Đã chuyển khoản', callback_data: `pay:confirm:${orderId}` }],
      [{ text: '❌ Hủy', callback_data: 'pay:cancel' }]
    ]
  }
});

// Telegram Stars Invoice
bot.sendInvoice(chatId, 'Nạp tiền', 'Nạp 100 xu vào tài khoản', 'payload_100xu', '', 'XTR', [{ amount: 100, label: '100 xu' }]);
```

## Bảo mật

- KHÔNG lưu thông tin bank/ví trong code → dùng env vars
- Log mọi giao dịch với timestamp
- Rate limit: tối đa 3 yêu cầu nạp tiền pending/user
- Timeout: auto-cancel đơn nạp sau 15 phút
