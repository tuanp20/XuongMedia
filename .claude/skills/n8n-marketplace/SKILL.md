---
name: n8n-marketplace
description: Thiết kế workflow n8n để bán trên marketplace - đóng gói, documentation, pricing. Kích hoạt khi user yêu cầu tạo workflow template bán được, đóng gói workflow, hoặc thiết kế sản phẩm automation.
---

# n8n Marketplace & Workflow Products - Expert Skill

Chuyên gia thiết kế workflow n8n thành sản phẩm bán được. Từ ý tưởng → workflow hoàn chỉnh → đóng gói → bán.

## Mindset: Workflow = Sản phẩm

```
Ý tưởng → Thiết kế Flow → Build → Test → Document → Package → Sell
```

**Workflow bán được = Giải quyết pain point cụ thể + Dễ setup + Có docs**

## Cách trình bày ý tưởng với Claude (Prompt Template)

### Template 1: Mô tả vấn đề → Giải pháp
```
Tôi muốn tạo workflow n8n:

PROBLEM: [Vấn đề cụ thể cần giải quyết]
WHO: [Ai sẽ dùng - freelancer, agency, ecom store, team]
INPUT: [Dữ liệu đầu vào - form, webhook, schedule, manual]
PROCESS: [Xử lý gì - AI phân tích, sync data, gửi thông báo]
OUTPUT: [Kết quả mong muốn - report, notification, updated DB]
TOOLS: [Các service liên quan - Google Sheets, Telegram, Gmail]

Ví dụ:
PROBLEM: Tự động xử lý đơn hàng từ Google Sheets và thông báo qua Telegram
WHO: Shop online nhỏ, 1-2 người vận hành
INPUT: Khách điền form → Google Sheets
PROCESS: AI validate đơn → Tính giá → Tạo mã đơn → Ghi DB
OUTPUT: Gửi xác nhận qua Telegram cho admin + khách
TOOLS: Google Sheets, Telegram Bot, AI (Claude)
```

### Template 2: Quick Automation Request
```
Tạo n8n workflow: [Trigger] → [Action 1] → [Action 2] → [Output]

Ví dụ: Google Sheets (new row) → AI classify → Telegram notify → Sheets update status
```

### Template 3: Workflow Upgrade
```
Tôi có workflow hiện tại: [mô tả/paste JSON]
Cần thêm: [tính năng mới]
Constraint: [giới hạn - budget, tools available, skill level]
```

## Niche Workflow Categories Bán Chạy

### 1. Lead Generation & CRM
```
Form → AI Qualify → Google Sheets CRM → Auto Email → Telegram Alert
```
- Target: Freelancer, agency
- Giá: $29-79

### 2. Content Automation
```
Schedule → AI Generate → Multi-platform Post → Analytics → Report
```
- Target: Content creator, social media manager
- Giá: $49-149

### 3. E-commerce Order Processing
```
Order Webhook → Validate → Inventory Check → Process → Notify
```
- Target: Shopify/WooCommerce store owner
- Giá: $39-99

### 4. Customer Support Bot
```
Chat Trigger → AI Agent + KB → Auto Reply → Escalate if needed
```
- Target: SaaS, service business
- Giá: $79-199

### 5. Data Sync & Reporting
```
Multi-source → Transform → Dashboard Sheet → Scheduled Report
```
- Target: Operations team, analysts
- Giá: $29-59

### 6. Recruitment / HR Automation
```
Form (apply) → AI Screen → Score → Sheets → Email → Slack notify
```
- Target: HR team, recruiter
- Giá: $49-129

## Đóng gói Workflow để bán

### Cấu trúc sản phẩm
```
workflow-product/
  workflow.json           → Export từ n8n
  README.md               → Hướng dẫn setup
  SETUP-GUIDE.md          → Step-by-step chi tiết
  screenshots/            → Ảnh workflow + demo
  sample-data/            → Data mẫu để test
    sample-input.json
    sample-sheet.csv
  variables.env.example   → Biến cần config
```

### README Template cho sản phẩm
```markdown
# [Workflow Name] - n8n Automation Template

## What it does
[1-2 câu mô tả giá trị]

## Perfect for
- [Target user 1]
- [Target user 2]

## Features
- ✅ [Feature 1]
- ✅ [Feature 2]
- ✅ [Feature 3]

## Requirements
- n8n (self-hosted or cloud)
- [Service 1] account
- [Service 2] API key

## Quick Setup (5 minutes)
1. Import `workflow.json` into n8n
2. Set up credentials: [list]
3. Configure variables: [list]
4. Test with Manual Trigger
5. Activate!

## Workflow Overview
[Screenshot of workflow]

## Support
[Contact info]
```

### Variables cần config (dùng n8n Variables)
```
// Trong workflow, dùng $vars thay vì hardcode
SHEET_URL → Google Sheet URL
ADMIN_CHAT_ID → Telegram admin chat ID
API_BASE_URL → External API URL
COMPANY_NAME → Tên công ty (hiện trong messages)
```

## Pricing Strategy

| Complexity | Nodes | AI? | Price Range |
|-----------|-------|-----|-------------|
| Simple | 5-10 | No | $19-39 |
| Medium | 10-20 | Optional | $39-79 |
| Advanced | 20-30+ | Yes | $79-149 |
| Enterprise | 30+ sub-workflows | Yes + RAG | $149-299 |

**Factors tăng giá:**
- Có AI Agent → +50%
- Có documentation chi tiết → +30%
- Có video hướng dẫn → +40%
- Có support → +50%
- Niche cụ thể (y tế, legal, finance) → +100%

## Nơi bán

| Platform | Commission | Audience |
|----------|-----------|----------|
| Gumroad | 10% | General |
| n8n Templates Gallery | Free | n8n users |
| Notion/Carrd landing page + Stripe | 2.9% | Direct traffic |
| Telegram channel | 0% | Your community |

## Quality Checklist Trước Khi Bán

```
□ Workflow chạy không lỗi với sample data
□ Tất cả credentials dùng variables, không hardcode
□ Có Error Trigger + error handling
□ README + SETUP guide đầy đủ
□ Screenshots workflow + demo output
□ Sample data để test
□ Tested trên n8n cloud + self-hosted
□ Node versions là mới nhất (không deprecated)
□ Naming conventions nhất quán
□ Comments/notes trong workflow nodes quan trọng
```

## Workflow JSON Optimization

### Trước khi export:
```javascript
// Xoá execution data, credentials values
// Chỉ giữ credential NAME (không giữ value)
// Set tất cả sensitive values thành variables

// Node naming phải rõ ràng
"name": "Fetch New Orders from Sheets"    // ✅
"name": "Google Sheets"                    // ❌
"name": "Google Sheets1"                   // ❌❌
```

### Thêm Sticky Notes làm docs
```json
{
  "parameters": {
    "content": "## Setup Required\n1. Create Google Sheet with columns: ID, Name, Email, Status\n2. Share sheet with service account\n3. Copy Sheet URL to variables",
    "width": 300,
    "height": 200
  },
  "type": "n8n-nodes-base.stickyNote",
  "typeVersion": 1,
  "position": [-200, -100]
}
```

## Combo: Telegram Bot + n8n Workflow

**Siêu combo bán chạy:**
```
Telegram Bot (giao diện) ←→ n8n (automation backend)

User nhắn bot → Bot gọi n8n webhook → n8n xử lý → Webhook response → Bot trả kết quả
```

**Ví dụ sản phẩm combo:**
1. **AI Customer Support Bot** - Bot Telegram + n8n AI Agent + Google Sheets KB
2. **Auto Order Bot** - Bot nhận đơn + n8n process + Sheets inventory
3. **Content Bot** - Bot yêu cầu → n8n AI generate → Bot trả content
4. **Analytics Bot** - Bot query → n8n fetch data → Bot trả báo cáo

## Hướng dẫn bán workflow nhanh

```
Ngày 1: Chọn niche + build workflow
Ngày 2: Test + viết docs
Ngày 3: Tạo landing page (Carrd/Notion) + setup Gumroad
Ngày 4: Post lên n8n community + social media
Ngày 5+: Collect feedback, iterate
```

Mục tiêu: 1 workflow/tuần, tích luỹ portfolio → passive income
