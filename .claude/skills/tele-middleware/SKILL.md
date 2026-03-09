---
name: tele-middleware
description: Middleware cho Telegram Bot - rate limiting, logging, error handling, session management. Kích hoạt khi user yêu cầu thêm bảo mật, rate limit, logging, hoặc xử lý lỗi.
---

# Telegram Middleware - Expert Skill

## File structure

```
src/
  middlewares/
    auth.middleware.js       → Admin/role check
    rateLimit.middleware.js   → Chống spam
    session.middleware.js     → Session management
    logger.middleware.js      → Logging
    error.middleware.js       → Global error handler
```

## Rate Limiter

```javascript
const rateLimits = new Map(); // chatId -> { count, resetAt }

const rateLimit = (maxRequests = 30, windowMs = 60000) => {
  return (chatId) => {
    const now = Date.now();
    const record = rateLimits.get(chatId);
    if (!record || now > record.resetAt) {
      rateLimits.set(chatId, { count: 1, resetAt: now + windowMs });
      return true;
    }
    record.count++;
    if (record.count > maxRequests) return false; // blocked
    return true;
  };
};
```

## Error Handler Pattern

```javascript
// Wrap mọi handler để catch error
const safeHandler = (fn) => async (...args) => {
  try {
    await fn(...args);
  } catch (error) {
    console.error(`[ERROR] ${error.message}`, error.stack);
    // Thông báo admin nếu lỗi nghiêm trọng
  }
};

// Sử dụng
bot.on('callback_query', safeHandler(async (query) => {
  // handler code...
}));
```

## Session Pattern (In-Memory)

```javascript
// Lưu trạng thái tạm cho user (chờ input, multi-step flow)
const sessions = new Map();

const getSession = (chatId) => sessions.get(chatId) || {};
const setSession = (chatId, data) => sessions.set(chatId, { ...getSession(chatId), ...data });
const clearSession = (chatId) => sessions.delete(chatId);

// Ví dụ: Chờ user nhập số tiền
setSession(chatId, { waitingFor: 'deposit_amount' });

// Trong message handler
const session = getSession(chatId);
if (session.waitingFor === 'deposit_amount') {
  const amount = parseInt(msg.text);
  // xử lý...
  clearSession(chatId);
}
```
