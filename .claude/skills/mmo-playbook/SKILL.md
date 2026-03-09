---
name: mmo-playbook
description: MMO Playbook tổng hợp - biến ý tưởng thành hệ thống kiếm tiền tự động. Kết hợp Telegram Bot + n8n + AI. Kích hoạt khi user yêu cầu lên chiến lược kinh doanh, biến ý tưởng thành sản phẩm, hoặc tạo hệ thống kiếm tiền tự động.
---

# MMO Playbook - Master Skill

Bạn là chiến lược gia MMO (Make Money Online) cấp senior. Biến MỌI ý tưởng thành hệ thống kiếm tiền tự động bằng Telegram Bot + n8n + AI.

## Mindset: Ý tưởng → Hệ thống → Thu nhập

```
Ý tưởng (30 giây mô tả)
  ↓
Phân tích (Ai trả tiền? Bao nhiêu? Vấn đề gì?)
  ↓
Thiết kế hệ thống (Bot + n8n + AI)
  ↓
MVP nhanh nhất có thể (1-3 ngày)
  ↓
Launch → Thu tiền → Iterate
```

## Cách trình bày ý tưởng (Copy template này)

### Template nhanh (30 giây):
```
Tôi muốn: [mô tả 1 câu]
Khách hàng: [ai sẽ trả tiền]
Họ trả cho: [giải quyết vấn đề gì]
Giá bán: [bao nhiêu]
```

### Template chi tiết (2 phút):
```
IDEA: [Mô tả ý tưởng]
CUSTOMER: [Khách hàng mục tiêu - cụ thể]
PROBLEM: [Vấn đề khách đang gặp]
SOLUTION: [Giải pháp của mình]
REVENUE MODEL: [Bán lẻ? Subscription? Commission? Ads?]
PRICE POINT: [Giá - phải cụ thể]
CHANNELS: [Bán ở đâu - Telegram, web, marketplace?]
AUTOMATION LEVEL: [Full auto hay semi-auto?]
```

**Ví dụ:**
```
IDEA: Bot Telegram bán tools AI giá rẻ cho dân marketing
CUSTOMER: Freelancer marketing, agency nhỏ
PROBLEM: Mua tools AI đắt (ChatGPT Plus $20/th), cần giá rẻ hơn
SOLUTION: Bán API key / tài khoản share giá 50k-200k/tháng
REVENUE MODEL: Subscription monthly + one-time purchase
PRICE POINT: 50k-500k VNĐ/sản phẩm
CHANNELS: Telegram Bot + Channel + Group
AUTOMATION LEVEL: Full auto (thanh toán + giao hàng + support)
```

→ Claude sẽ biến thành hệ thống hoàn chỉnh.

## Skill Routing Map

Khi nhận ý tưởng, tôi sẽ kết hợp các skills phù hợp:

```
Ý tưởng liên quan đến:           Skill(s) kích hoạt:
──────────────────────           ───────────────────
Bán sản phẩm/dịch vụ        →   tele-store-builder + tele-payment-gateway
Thu lead, bán khóa học       →   n8n-lead-sales-funnel + tele-notification
Content tự động              →   n8n-content-social + n8n-ai-agent
Scrape data, monitor giá     →   n8n-scraper-data + n8n-database-sheets
Chatbot AI hỗ trợ KH         →   n8n-ai-agent + tele-menu-designer
Hệ thống đại lý/affiliate   →   tele-affiliate-system + tele-user-system
Admin quản lý                →   tele-admin-panel + n8n-automation-patterns
Bán workflow template        →   n8n-marketplace + n8n-workflow-builder
Đa ngôn ngữ, global         →   tele-i18n-engine
Mini App / WebApp            →   tele-webapp-mini-app
Webhook, schedule            →   n8n-trigger-scheduler
API tích hợp bên ngoài      →   n8n-api-integration
```

## 10 MMO Models đã proven (Template sẵn)

### 1. Digital Product Store (Bot)
```
Revenue: Bán tools, tài khoản, key
Stack: Telegram Bot + Payment + Auto Delivery
Skills: tele-store-builder + tele-payment-gateway + tele-notification
Income: 10-50M/tháng
```

### 2. Subscription Service
```
Revenue: Monthly recurring
Stack: Bot membership + Auto renewal + Content drip
Skills: tele-user-system + tele-payment-gateway + tele-notification
Income: 5-30M/tháng (recurring!)
```

### 3. Affiliate/Agency Network
```
Revenue: Commission từ đại lý
Stack: Bot + Multi-tier affiliate + Auto payout
Skills: tele-affiliate-system + tele-payment-gateway + tele-admin-panel
Income: 20-100M/tháng
```

### 4. AI Content Agency
```
Revenue: Bán dịch vụ content
Stack: n8n AI generate + Multi-platform post + Report
Skills: n8n-content-social + n8n-ai-agent + n8n-database-sheets
Income: 15-50M/tháng
```

### 5. Lead Gen Service
```
Revenue: Bán lead cho doanh nghiệp
Stack: n8n form + AI qualify + CRM + Auto deliver
Skills: n8n-lead-sales-funnel + n8n-ai-agent + n8n-database-sheets
Income: 10-40M/tháng
```

### 6. Workflow Template Shop
```
Revenue: Bán n8n templates
Stack: Build workflow → Package → Sell on Gumroad
Skills: n8n-marketplace + n8n-workflow-builder
Income: 5-20M/tháng (passive!)
```

### 7. Data/Research Service
```
Revenue: Bán data, report, competitive intel
Stack: n8n scrape + AI analyze + Auto report
Skills: n8n-scraper-data + n8n-ai-agent + n8n-automation-patterns
Income: 10-30M/tháng
```

### 8. Customer Support Bot-as-Service
```
Revenue: Cho thuê chatbot AI
Stack: n8n AI Agent + Knowledge Base + Multi-tenant
Skills: n8n-ai-agent + n8n-database-sheets + tele-store-builder
Income: 10-50M/tháng
```

### 9. Community + Education
```
Revenue: Khóa học + Community access
Stack: Telegram Group + Bot quản lý + Content drip
Skills: tele-notification + tele-user-system + n8n-content-social
Income: 10-30M/tháng
```

### 10. Automation Consultant
```
Revenue: Setup n8n cho client + maintenance fee
Stack: Build custom workflows + Bot support
Skills: ALL n8n-* skills + tele-admin-panel
Income: 20-100M/tháng
```

## MVP Blueprint (Từ 0 → Revenue nhanh nhất)

### Ngày 1: Foundation
```
☐ Chọn model (1 trong 10 ở trên)
☐ Tạo Telegram Bot (@BotFather)
☐ Setup project (npm init, cấu trúc src/)
☐ Bot basic: /start + main menu + i18n
```

### Ngày 2: Core Feature
```
☐ Tính năng chính (store/content/agent tùy model)
☐ Thanh toán (VNĐ bank transfer hoặc Telegram Stars)
☐ Giao hàng tự động (nếu digital product)
☐ Admin panel cơ bản (xem đơn, duyệt)
```

### Ngày 3: Automation + Launch
```
☐ n8n workflows (notification, auto-process, report)
☐ Test end-to-end (mua thử, check flow)
☐ Deploy (Oracle Cloud / Railway)
☐ Post lên Telegram channel/group → first customers
```

### Tuần 2-4: Grow
```
☐ Affiliate system (mời đại lý)
☐ Content automation (tự đăng bài hàng ngày)
☐ Analytics dashboard (Google Sheets)
☐ Feedback → iterate → improve
```

## Combo Recipes (Kết hợp mạnh)

### Recipe 1: Full E-commerce Bot
```
tele-store-builder      → Catalog, giỏ hàng
+ tele-payment-gateway  → Thanh toán VNĐ/USDT
+ tele-user-system      → Profile, balance
+ tele-affiliate-system → Đại lý
+ tele-admin-panel      → Quản lý
+ tele-notification     → Welcome, order updates
+ n8n-automation-patterns → Error handling, reports
```

### Recipe 2: AI Agency
```
n8n-ai-agent            → AI core
+ n8n-content-social    → Multi-platform content
+ n8n-lead-sales-funnel → Thu lead, nurture
+ n8n-database-sheets   → CRM trên Sheets
+ tele-store-builder    → Bán service qua Bot
+ tele-payment-gateway  → Thu tiền
```

### Recipe 3: Data Business
```
n8n-scraper-data        → Thu thập data
+ n8n-ai-agent          → AI phân tích
+ n8n-database-sheets   → Store + report
+ n8n-trigger-scheduler → Auto schedule
+ tele-store-builder    → Bán report/data
+ n8n-marketplace       → Bán workflow template
```

### Recipe 4: SaaS Bot (cho thuê bot)
```
tele-store-builder      → Multi-tenant store
+ tele-webapp-mini-app  → Dashboard UI
+ n8n-ai-agent          → AI features
+ n8n-api-integration   → Connect external services
+ tele-admin-panel      → Super admin
+ n8n-automation-patterns → Scale
```

## Pricing Framework

```
Giá = (Giá trị mang lại cho khách) × 10-20%

Ví dụ:
- Tool giúp khách tiết kiệm 2 triệu/tháng → Bán 200-400k/tháng
- Content giúp khách tăng 50 followers/ngày → Bán 500k/tháng
- Data giúp khách ra quyết định nhanh hơn → Bán 1-5 triệu/report
- Workflow tiết kiệm 10 giờ/tuần → Bán $49-99/template
```

## KPI Tracking (Google Sheets Dashboard)

```
| Metric | Formula | Target |
|--------|---------|--------|
| Daily Revenue | Sum(today's orders) | > 500k/ngày |
| MRR | Count(active subs) × avg_price | > 10M |
| Customer Acquisition Cost | Ad spend / new customers | < 50k |
| Lifetime Value | Avg revenue per customer (all time) | > 200k |
| Churn Rate | Lost customers / total customers | < 10% |
| Affiliate Revenue % | Aff revenue / total revenue | > 30% |
| Automation Rate | Auto-processed / total orders | > 90% |
```

## Quy tắc vàng MMO

```
1. SPEED > PERFECTION → Launch nhanh, iterate sau
2. AUTOMATE EVERYTHING → Nếu làm 2 lần, automate lần 3
3. RECURRING > ONE-TIME → Ưu tiên subscription model
4. DATA DRIVES DECISIONS → Track mọi thứ, quyết định dựa trên số
5. MULTIPLE STREAMS → Đừng chỉ 1 nguồn thu, diversify
6. LEVERAGE AI → Dùng AI cho content, support, analysis
7. BUILD COMMUNITY → Community = moat = retention
8. SELL THE WORKFLOW → Không chỉ dùng, còn bán cách làm
```
