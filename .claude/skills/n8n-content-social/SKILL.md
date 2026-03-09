---
name: n8n-content-social
description: Tự động hoá Content & Social Media trong n8n - AI generate content, multi-platform posting, scheduling, repurpose, analytics. Kích hoạt khi user yêu cầu tạo content tự động, đăng bài nhiều nền tảng, lập lịch content, hoặc content marketing.
---

# n8n Content & Social Media Automation - Expert Skill

Chuyên gia tự động hoá content marketing. AI tạo content → đăng multi-platform → track performance → optimize.

## Content Pipeline Overview

```
Idea/Topic                Generate              Distribute              Track
──────────               ────────              ──────────              ─────
Trending topics  ──┐
Content calendar ──┤→   AI Generate    →    Multi-platform     →    Analytics
RSS feeds        ──┤    (Claude/GPT)        ├── Telegram             Google Sheets
User requests    ──┘    + Image gen         ├── Facebook             Dashboard
                        + Format            ├── Twitter/X
                                            ├── LinkedIn
                                            ├── YouTube desc
                                            └── Blog/SEO
```

## Pattern 1: AI Content Generator → Multi-Platform

```
Schedule Trigger (daily 7am)
  → Google Sheets (read content calendar: today's topic)
  → AI Agent (generate content)
    ├── Anthropic (Claude) - chất lượng cao
    ├── Tool: Google Sheets (research data)
    └── Structured Output Parser (JSON format)
  → Code (format for each platform)
  → Parallel:
    ├── Telegram (post to channel)
    ├── HTTP Request (Facebook Graph API)
    ├── HTTP Request (Twitter/X API)
    └── Google Sheets (log posted content)
```

**AI Content System Prompt:**
```
Bạn là content creator chuyên nghiệp cho lĩnh vực {niche}.

Từ topic: "{topic}"
Tạo content cho các nền tảng:

1. TELEGRAM (max 4096 chars):
   - Hook mạnh (dòng đầu tiên)
   - Giá trị chính (3-5 bullet points)
   - CTA cuối bài
   - Emoji phù hợp, không spam

2. FACEBOOK (max 500 chars):
   - Storytelling ngắn
   - Câu hỏi tương tác cuối bài
   - 3-5 hashtags

3. TWITTER/X (max 280 chars):
   - Punchy, gây tò mò
   - 1-2 hashtags
   - Thread option (5 tweets nếu topic dài)

4. LINKEDIN (max 1300 chars):
   - Professional tone
   - Data/insight driven
   - Industry hashtags

Output JSON:
{
  "telegram": { "text": "", "preview": true },
  "facebook": { "text": "", "hashtags": [] },
  "twitter": { "text": "", "thread": [] },
  "linkedin": { "text": "", "hashtags": [] },
  "seoTitle": "",
  "seoDescription": "",
  "tags": []
}
```

## Pattern 2: Content Repurpose Machine

```
Webhook (new blog post / long content)
  → AI Agent (repurpose)
    └── System: "Chuyển long-form content thành các format ngắn"
  → Code (split outputs)
  → Parallel:
    ├── 5 Twitter threads
    ├── 3 Telegram posts
    ├── 1 LinkedIn article summary
    ├── 10 quote cards (text for Canva)
    ├── 1 YouTube script outline
    └── Google Sheets (content inventory)
```

**Repurpose Prompt:**
```
Từ bài viết dài sau, tạo:

1. TWITTER THREAD (5-7 tweets, mỗi tweet < 280 chars)
2. TELEGRAM POSTS (3 bài, mỗi bài focus 1 góc nhìn)
3. LINKEDIN SUMMARY (professional, insight-driven)
4. QUOTE CARDS (10 câu quote powerful từ bài, < 100 chars mỗi câu)
5. YOUTUBE OUTLINE (intro, 5 main points, CTA)
6. EMAIL NEWSLETTER (subject line + 200 word summary)

Bài viết gốc:
{content}
```

## Pattern 3: Trending Topics → Auto Content

```
Schedule (every 6 hours)
  → HTTP Request (Google Trends API / Twitter Trending)
  → AI Agent (filter relevant trends for niche)
  → If (relevant trend found)
    ├── true → AI Agent (generate hot take content)
    │   → Multi-platform post
    │   → Google Sheets (log trending content)
    └── false → NoOp
```

## Pattern 4: RSS → Auto Curate → Post

```
Schedule (every 2 hours)
  → HTTP Request (RSS feeds: industry blogs)
  → Code (parse RSS, extract new items)
  → Filter (not already posted - check Sheets)
  → AI Agent (summarize + add commentary)
  → Telegram (post curated content)
  → Google Sheets (mark as posted)
```

```javascript
// Code node: Parse RSS
const Parser = require('rss-parser');
// Nếu không có package, dùng XML parse
const xml = $json.data;
const items = [];
// Simple XML extraction
const regex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<description>(.*?)<\/description>[\s\S]*?<\/item>/g;
let match;
while ((match = regex.exec(xml)) !== null) {
  items.push({ title: match[1], link: match[2], description: match[3].replace(/<[^>]*>/g, '') });
}
return items.slice(0, 5).map(item => ({ json: item }));
```

## Pattern 5: Content Calendar Automation

**Google Sheets Content Calendar:**
```
| Date | Day | Topic | Platform | Status | Content | PostedAt | Engagement |
| 2026-03-10 | Mon | AI Tools Review | all | scheduled | ... | | |
| 2026-03-11 | Tue | Tutorial | telegram,fb | draft | ... | | |
```

```
Schedule (daily 6am)
  → Google Sheets (read today's content)
  → Filter (status = "scheduled" OR status = "approved")
  → SplitInBatches
    → Code (parse platform list)
    → Switch (platform)
      ├── telegram → Telegram send
      ├── facebook → HTTP Request (FB API)
      └── twitter → HTTP Request (X API)
    → Google Sheets (update status = "posted", add PostedAt)
```

## Pattern 6: UGC & Comment Automation

```
[Monitor mentions]
Schedule (every 30 min)
  → HTTP Request (social media mentions API)
  → Filter (new mentions)
  → AI Agent (classify: positive/negative/question)
  → Switch
    ├── positive → Auto like + Thank you reply
    ├── negative → Telegram (alert team) + Draft response
    └── question → AI Agent (generate answer) → Post reply
  → Google Sheets (log all interactions)
```

## Pattern 7: Telegram Channel Growth

```
[Auto-post schedule]
Schedule Trigger (custom times per day)
  → Google Sheets (content queue)
  → Telegram (post to channel)

[Welcome new members]
Telegram Trigger (new member)
  → Telegram (welcome DM + pin rules)
  → Google Sheets (track member growth)

[Engagement tracking]
Schedule (daily)
  → HTTP Request (Telegram Bot API: getChat)
  → Code (extract member count, calculate growth)
  → Google Sheets (daily stats)
```

## Social Media API Patterns

### Facebook Graph API
```json
{
  "parameters": {
    "method": "POST",
    "url": "=https://graph.facebook.com/v18.0/{{ $vars.FB_PAGE_ID }}/feed",
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify({ message: $json.facebook.text, access_token: $vars.FB_ACCESS_TOKEN }) }}"
  },
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2
}
```

### Twitter/X API v2
```json
{
  "parameters": {
    "method": "POST",
    "url": "https://api.twitter.com/2/tweets",
    "authentication": "genericCredentialType",
    "genericAuthType": "oAuth1Api",
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify({ text: $json.twitter.text }) }}"
  },
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2
}
```

### Telegram Channel Post
```json
{
  "parameters": {
    "operation": "sendMessage",
    "chatId": "={{ $vars.CHANNEL_ID }}",
    "text": "={{ $json.telegram.text }}",
    "additionalFields": {
      "parse_mode": "HTML",
      "disable_web_page_preview": false
    }
  },
  "type": "n8n-nodes-base.telegram",
  "typeVersion": 1.2
}
```

## Content Performance Tracking

```
Schedule (daily 11pm)
  → Google Sheets (read today's posts)
  → SplitInBatches
    → Switch (platform)
      ├── telegram → HTTP Request (getMessageStats - nếu channel admin)
      ├── facebook → HTTP Request (FB Insights API)
      └── twitter → HTTP Request (X Analytics API)
    → Google Sheets (update engagement: views, likes, shares, comments)
  → Code (calculate best performing content)
  → AI Agent (analyze patterns, suggest improvements)
  → Google Sheets (write weekly report)
  → Telegram (send report to admin)
```

## Content Templates Library

```javascript
// Code node: Content template engine
const templates = {
  tip: {
    telegram: "💡 **TIP #{number}:** {title}\n\n{content}\n\n👉 {cta}",
    twitter: "💡 Tip: {short_content}\n\n{hashtags}",
  },
  case_study: {
    telegram: "📊 **CASE STUDY**\n\n{client} đã {result} trong {timeframe}\n\nCách làm:\n{steps}\n\n🔗 {cta}",
    twitter: "📊 {client}: {result} in {timeframe}\n\nThread 🧵👇",
  },
  listicle: {
    telegram: "📋 **{number} {topic}**\n\n{items}\n\n💬 Bạn thêm gì nữa?",
    twitter: "📋 {number} {topic} you need to know:\n\n🧵👇"
  },
  behind_scenes: {
    telegram: "🎬 **Behind the scenes**\n\n{story}\n\n{lesson}",
  },
  poll: {
    telegram: "📊 {question}",  // Dùng Telegram poll feature
  }
};
```

## Best Practices Content Automation

```
✅ Content calendar trước 1 tuần, AI assist, human review
✅ Mỗi platform tone khác nhau (Telegram casual, LinkedIn professional)
✅ 80% value content, 20% promotional
✅ Track metrics hàng ngày, optimize hàng tuần
✅ Repurpose 1 long-form → 10+ short-form pieces
✅ Batch generate content (AI tạo cả tuần 1 lần)
✅ Evergreen content recycle sau 3-6 tháng

❌ KHÔNG post cùng content y hệt trên mọi platform
❌ KHÔNG chỉ AI generate mà không review (hallucination risk)
❌ KHÔNG spam quá 3 posts/ngày trên 1 platform
❌ KHÔNG ignore comments/engagement
❌ KHÔNG quên CTA (call to action) trong mỗi post
```
