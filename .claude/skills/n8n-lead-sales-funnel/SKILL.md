---
name: n8n-lead-sales-funnel
description: Xây dựng hệ thống Lead Generation & Sales Funnel tự động trong n8n - thu lead, email sequence, nurture, scoring, convert. Kích hoạt khi user yêu cầu tạo funnel bán hàng, thu lead, email marketing, hoặc nurture sequence.
---

# n8n Lead Generation & Sales Funnel - Expert Skill

Chuyên gia xây dựng hệ thống thu lead, nurture, và convert tự động. Từ traffic → lead → customer → revenue.

## Sales Funnel Overview

```
Traffic Sources          Lead Capture         Nurture           Convert            Retain
─────────────           ────────────         ───────           ───────            ──────
Facebook Ads    ──┐
Google Ads      ──┤     Form/Landing   →    Email Seq    →    Sales Page    →    Upsell
Telegram Channel──┤──→  Webhook        →    Telegram Drip→    Payment      →    Community
SEO Content     ──┤     Chatbot        →    AI Follow-up →    Consultation →    Referral
Referral        ──┘     API            →    Retargeting  →    Checkout     →    Subscription
```

## Pattern 1: Lead Capture → Google Sheets CRM

```
Form Trigger (landing page)
  → Set (normalize data: name, email, phone, source, utm_*)
  → Google Sheets (append to "Leads" sheet)
  → AI Agent (score lead: hot/warm/cold)
  → Switch (lead score)
    ├── hot → Telegram (alert sales team ngay) + Gmail (send offer)
    ├── warm → Gmail (send nurture email #1) + Schedule follow-up
    └── cold → Gmail (send welcome + free content)
```

**Google Sheets CRM Structure:**
```
| ID | Name | Email | Phone | Source | UTM_Campaign | Score | Status | CreatedAt | LastContact | Notes |
```

**Lead Scoring bằng AI:**
```json
{
  "parameters": {
    "options": {
      "systemMessage": "Bạn là lead scoring AI. Dựa trên thông tin lead, cho điểm 1-100 và phân loại hot/warm/cold.\n\nCriteria:\n- Có số điện thoại: +20\n- Email doanh nghiệp (.com.vn, công ty): +20\n- Source là paid ads: +15\n- Đã điền form chi tiết: +15\n- Budget mention: +30\n\nOutput JSON: {\"score\": number, \"tier\": \"hot|warm|cold\", \"reason\": \"string\"}"
    }
  },
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 1.7
}
```

## Pattern 2: Email Sequence (Drip Campaign)

### Sequence Setup
```
Lead captured
  → Gmail (Day 0: Welcome + Free value)
  → Wait (1 day)
  → Gmail (Day 1: Pain point + Story)
  → Wait (2 days)
  → Gmail (Day 3: Social proof + Case study)
  → Wait (2 days)
  → Gmail (Day 5: Offer + Urgency)
  → Wait (1 day)
  → Gmail (Day 6: Last chance + Bonus)
  → Google Sheets (update status)
```

### Smart Drip (kiểm tra trước khi gửi)
```
Wait (next email due)
  → Google Sheets (read lead status)
  → If (status !== "converted" AND status !== "unsubscribed")
    ├── true → Gmail (send next email) → Google Sheets (update lastContact)
    └── false → NoOp (skip)
```

### Email Template Variables
```javascript
// Code node: Personalize email
const lead = $json;
const templates = {
  day0: {
    subject: `${lead.name}, đây là tài liệu miễn phí cho bạn`,
    body: `Chào ${lead.name},\n\nCảm ơn bạn đã đăng ký...`
  },
  day1: {
    subject: `${lead.name}, bạn có gặp vấn đề này không?`,
    body: `Hi ${lead.name},\n\nHầu hết ${lead.industry || 'doanh nghiệp'}...`
  }
};
return [{ json: { ...lead, email_content: templates[lead.currentStep] } }];
```

## Pattern 3: Telegram Drip (thay Email)

```
User /start bot
  → Save user to Sheets (lead)
  → Telegram (Day 0: Welcome + Menu)
  → Schedule Trigger (check daily)
    → Google Sheets (get users need follow-up)
    → Filter (daysSinceJoin matches sequence step)
    → SplitInBatches
      → Telegram (send drip message)
      → Google Sheets (update step)
```

**Telegram Drip Messages:**
```javascript
const dripMessages = {
  1: { text: "👋 Chào bạn! Hôm nay mình chia sẻ...", delay: "1d" },
  3: { text: "📊 Case study: Anh A đã tăng 300%...", delay: "3d" },
  5: { text: "🎯 Bạn đã sẵn sàng? Ưu đãi đặc biệt...", delay: "5d" },
  7: { text: "⏰ Chỉ còn 24h! Giá sẽ tăng sau...", delay: "7d" }
};
```

## Pattern 4: Multi-Channel Funnel

```
[Entry Points - tất cả về 1 Sheets CRM]
Facebook Lead Ad → Webhook → Normalize → Sheets
Google Form → Sheets Trigger → Normalize → Sheets
Telegram Bot → Webhook → Normalize → Sheets
Landing Page Form → Webhook → Normalize → Sheets

[Unified Processing]
Schedule (every 15 min)
  → Sheets (get new unprocessed leads)
  → AI Agent (score + categorize)
  → Switch (preferred channel)
    ├── email → Gmail sequence
    ├── telegram → Telegram drip
    └── both → Gmail + Telegram
```

## Pattern 5: Webinar/Event Funnel

```
[Registration]
Form Trigger → Sheets (registrant) → Gmail (confirmation + calendar link)

[Pre-event]
Schedule (1 day before) → Sheets (get registrants) → Gmail (reminder) + Telegram (reminder)

[Post-event]
Manual Trigger → Sheets (get attendees)
  → AI Agent (segment: engaged/passive/no-show)
  → Switch
    ├── engaged → Gmail (special offer, 48h deadline)
    ├── passive → Gmail (replay link + softer offer)
    └── no-show → Gmail (replay + reschedule)
```

## Pattern 6: Sales Pipeline Automation

```
Google Sheets Pipeline:
| LeadID | Stage | Owner | Value | NextAction | DueDate |

Stages: new → contacted → qualified → proposal → negotiation → won/lost

Schedule (hourly)
  → Sheets (get overdue actions)
  → SplitInBatches
    → Telegram (remind sales owner)

Sheets Trigger (stage changed)
  → Switch (new stage)
    ├── qualified → Telegram (alert manager)
    ├── proposal → Gmail (send proposal template)
    ├── won → Gmail (send invoice) + Sheets (update revenue)
    └── lost → AI Agent (analyze why, suggest improvement)
```

## Pattern 7: Retargeting & Re-engagement

```
Schedule (weekly)
  → Sheets (get inactive leads: no interaction > 14 days)
  → AI Agent (craft personalized re-engagement message)
  → Switch (channel)
    ├── email → Gmail (re-engagement)
    └── telegram → Telegram (re-engagement)
  → Sheets (update lastContact)

[Auto-cleanup]
Schedule (monthly)
  → Sheets (get leads inactive > 90 days)
  → Sheets (move to "Archive" sheet)
```

## UTM Tracking Template

```javascript
// Code node: Parse UTM from form/webhook data
const url = new URL($json.referrer || $json.landing_page || '');
const utm = {
  source: url.searchParams.get('utm_source') || 'direct',
  medium: url.searchParams.get('utm_medium') || 'none',
  campaign: url.searchParams.get('utm_campaign') || 'none',
  content: url.searchParams.get('utm_content') || '',
  term: url.searchParams.get('utm_term') || ''
};
return [{ json: { ...($json), ...utm } }];
```

## Metrics Dashboard (Google Sheets)

```
Schedule (daily midnight)
  → Sheets (read all leads)
  → Code (calculate metrics)
  → Sheets (write to "Dashboard" sheet)

Metrics:
| Date | New Leads | By Source | Conversion Rate | Revenue | CAC | LTV |
```

```javascript
// Code node: Calculate funnel metrics
const leads = $input.all().map(i => i.json);
const today = $now.format('yyyy-MM-dd');

const metrics = {
  date: today,
  totalLeads: leads.length,
  newToday: leads.filter(l => l.CreatedAt?.startsWith(today)).length,
  bySource: {},
  converted: leads.filter(l => l.Status === 'converted').length,
  conversionRate: 0,
  totalRevenue: leads.reduce((sum, l) => sum + (parseFloat(l.Revenue) || 0), 0)
};

// Group by source
leads.forEach(l => {
  const src = l.Source || 'unknown';
  metrics.bySource[src] = (metrics.bySource[src] || 0) + 1;
});

metrics.conversionRate = ((metrics.converted / metrics.totalLeads) * 100).toFixed(1) + '%';

return [{ json: metrics }];
```

## Best Practices MMO Funnel

```
✅ Thu lead ở MỌI touchpoint (form, bot, comment, DM)
✅ Response time < 5 phút cho hot leads (dùng Telegram alert)
✅ Personalize mọi message bằng AI
✅ A/B test email subject lines (2 variants → track open rate)
✅ Segment leads theo behavior, không chỉ demographics
✅ Dùng Google Sheets làm CRM giai đoạn đầu → migrate Postgres khi scale
✅ Track UTM params để biết traffic source nào convert tốt nhất

❌ KHÔNG spam lead (max 1 email/ngày, 3 Telegram/tuần)
❌ KHÔNG bỏ qua unsubscribe → legal risk
❌ KHÔNG gửi cùng 1 message cho mọi segment
❌ KHÔNG quên follow-up lead hot trong 24h
```
