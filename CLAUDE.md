# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Telegram Bot Store - hệ thống bán tools/dịch vụ số trên Telegram, hỗ trợ đa ngôn ngữ (VI/EN), thanh toán VNĐ/USDT, quản lý user và admin panel.

## Commands

- **Run bot:** `npm start` (hoặc `node src/index.js`)
- **Dev mode (auto-reload):** `npm run dev`
- **Legacy (file gốc):** `npm run legacy`
- **Install deps:** `npm install`

## Setup

File `.env` cần có `TOKEN_BOT`. Xem `.env.example` cho toàn bộ biến môi trường.

## Architecture

```
src/
  index.js              → Entry point, load handlers + start bot
  bot.js                → Bot instance (singleton, dùng chung)
  config/index.js       → Tập trung config từ env vars
  handlers/
    index.js            → Registry, load tất cả handlers
    start.handler.js    → /start command + deep link (referral)
    menu.handler.js     → Callback query router (m:, pay:, s:, lang:)
    reply.handler.js    → Reply keyboard text handler
  keyboards/
    _builder.js         → KeyboardBuilder utility class
    main.keyboard.js    → Tất cả keyboard factories
  locales/
    index.js            → t(lang, key, params) helper
    vi.json / en.json   → Translation strings
  middlewares/
    session.js          → In-memory session (lang, state)
    auth.js             → Admin check
  services/             → Business logic (store, payment, user)
  models/               → Data schemas
  utils/                → Helpers
```

## Key Patterns

- **Callback data convention:** prefix-based routing — `m:` menu, `s:` store, `pay:` payment, `lang:` language, `a:` admin. Max 64 bytes.
- **i18n:** Mọi text hiển thị qua `t(lang, 'key', {params})`. Thêm text mới phải cập nhật cả `vi.json` và `en.json`.
- **Menu navigation:** Luôn dùng `editMessageText` thay vì `sendMessage` để tránh spam chat.
- **KeyboardBuilder:** Dùng `KeyboardBuilder` class thay vì hardcode object. Gọi `.build()` cho inline, `.buildReply()` cho reply keyboard.
- **Handler registration:** Thêm handler mới → tạo file `src/handlers/{name}.handler.js` → require trong `src/handlers/index.js`.
- **Bot singleton:** Import `require('../bot')` — KHÔNG tạo instance mới.

## Skills (`.claude/skills/`)

Hệ thống skills cho Claude Code, auto-load theo ngữ cảnh yêu cầu:

### Telegram Bot Skills (`tele-*`)

| Skill | Khi nào dùng |
|-------|-------------|
| `tele-store-builder` | Thêm sản phẩm, catalog, giỏ hàng, đơn hàng |
| `tele-menu-designer` | Tạo/sửa menu, keyboard, navigation flow |
| `tele-payment-gateway` | Nạp tiền, thanh toán, QR, crypto |
| `tele-user-system` | Profile, referral, balance, user management |
| `tele-admin-panel` | Admin commands, stats, broadcast, duyệt đơn |
| `tele-notification` | Thông báo tự động, scheduled, welcome flow |
| `tele-i18n-engine` | Thêm ngôn ngữ, dịch nội dung |
| `tele-middleware` | Rate limit, session, error handling, logging |
| `tele-webapp-mini-app` | Mini App / WebApp nhúng trong Telegram |

### n8n Automation Skills (`n8n-*`)

| Skill | Khi nào dùng |
|-------|-------------|
| `n8n-workflow-builder` | Tạo workflow, thiết kế flow, kết nối nodes, expressions |
| `n8n-ai-agent` | AI Agent, chatbot, LLM, memory, RAG, tool-calling |
| `n8n-database-sheets` | Postgres, MySQL, Google Sheets, Supabase, data sync |
| `n8n-trigger-scheduler` | Webhook, cron, form trigger, event-driven |
| `n8n-api-integration` | HTTP Request, OAuth, app nodes (Telegram, Slack, Gmail) |
| `n8n-automation-patterns` | Error handling, optimization, sub-workflow, testing |
| `n8n-marketplace` | Đóng gói workflow bán, pricing, documentation |
