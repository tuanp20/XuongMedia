---
name: n8n-scraper-data
description: Thu thập và xử lý data trong n8n - web scraping, API data extraction, competitive analysis, price monitoring. Kích hoạt khi user yêu cầu scrape website, thu thập data, monitor giá, phân tích đối thủ, hoặc data extraction.
---

# n8n Scraper & Data Extraction - Expert Skill

Chuyên gia thu thập data, scraping, monitoring, và competitive intelligence bằng n8n.

## Scraping Strategy

```
LUÔN ưu tiên theo thứ tự:
1. Official API (tốt nhất, ổn định)
2. RSS Feed (đơn giản, hợp pháp)
3. Public Data API (Google, social media)
4. HTTP Request + HTML Parse (cuối cùng)
```

## Pattern 1: Price Monitoring

```
Schedule (every 6 hours)
  → HTTP Request (GET product pages - multiple sources)
  → Code (extract prices from HTML/JSON)
  → Google Sheets (append price history)
  → If (price changed significantly)
    ├── true → Telegram (alert: "Giá XYZ giảm 20%!")
    └── false → NoOp
  → Schedule (weekly) → Code (price trend analysis) → Sheets (report)
```

```javascript
// Code node: Extract price from JSON API response
const products = $input.all();
return products.map(item => {
  const data = item.json;
  return {
    json: {
      name: data.name || data.title,
      price: parseFloat(data.price || data.sale_price || '0'),
      originalPrice: parseFloat(data.original_price || data.compare_at_price || '0'),
      discount: data.discount || 0,
      source: data._source,
      url: data.url,
      scrapedAt: new Date().toISOString(),
      inStock: data.available !== false
    }
  };
});
```

## Pattern 2: Competitor Monitoring

```
Schedule (daily)
  → SplitInBatches (competitor list from Sheets)
    → HTTP Request (GET competitor page/API)
    → Code (extract: products, prices, new features)
    → Google Sheets (competitor data)
  → AI Agent (analyze changes, generate insights)
  → Telegram (daily competitor report)
```

**Competitor Tracking Sheet:**
```
| Competitor | URL | Products Count | Price Range | Last Change | New Features | Notes |
```

## Pattern 3: Social Media Data Collection

### Telegram Channel Stats
```
Schedule (daily)
  → HTTP Request (Telegram Bot API)
    GET /getChatMemberCount?chat_id=@channel
  → Google Sheets (daily subscriber count)
  → Code (calculate growth rate)
  → If (unusual spike or drop)
    → Telegram (alert admin)
```

### Public Data via APIs
```javascript
// Code node: Collect from multiple social APIs
const sources = [
  { name: 'telegram', api: `https://api.telegram.org/bot${$vars.BOT_TOKEN}/getChatMemberCount?chat_id=${$vars.CHANNEL_ID}` },
  // Add other public API endpoints
];

return sources.map(s => ({ json: { source: s.name, url: s.api } }));
```

## Pattern 4: Google Trends / Keyword Research

```
Schedule (weekly Monday 8am)
  → HTTP Request (Google Trends API / SerpAPI)
  → Code (parse trending keywords in niche)
  → AI Agent (filter relevant + generate content ideas)
  → Google Sheets (keyword database)
  → Telegram (weekly trends report)
```

## Pattern 5: Job/Freelance Opportunity Scraper

```
Schedule (every 2 hours)
  → HTTP Request (Freelance platform APIs / RSS)
  → Code (filter by keywords, budget range)
  → Filter (not already in database)
  → Google Sheets (save new opportunities)
  → If (matches hot criteria)
    ├── true → Telegram (instant alert: "New $500+ job!")
    └── false → Just log
```

## Pattern 6: Review & Feedback Aggregator

```
Schedule (daily)
  → Parallel:
    ├── HTTP Request (Google Reviews API)
    ├── HTTP Request (Facebook Reviews)
    └── HTTP Request (App Store reviews)
  → Merge (all reviews)
  → Filter (new since last check)
  → AI Agent (sentiment analysis + categorize)
  → Google Sheets (review database)
  → Switch (sentiment)
    ├── negative → Telegram (urgent alert)
    └── positive → Auto thank + request referral
```

## Pattern 7: Email Inbox Scraper (Receipts, Orders)

```
Email Trigger (IMAP - specific labels)
  → Filter (from: known senders)
  → AI Agent (extract: order ID, amount, product, date)
  → Google Sheets (transaction log)
  → Code (calculate totals)
  → Schedule (monthly) → Sheets (monthly report)
```

## HTTP Request Scraping Patterns

### Basic GET with Headers
```json
{
  "parameters": {
    "method": "GET",
    "url": "={{ $json.targetUrl }}",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {"name": "User-Agent", "value": "Mozilla/5.0 (compatible; DataBot/1.0)"},
        {"name": "Accept", "value": "text/html,application/json"},
        {"name": "Accept-Language", "value": "vi-VN,vi;q=0.9,en;q=0.8"}
      ]
    },
    "options": {
      "response": {"response": {"responseFormat": "text"}},
      "timeout": 10000
    }
  },
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2
}
```

### Extract Data from HTML
```javascript
// Code node: Simple HTML data extraction
const html = $json.data;

// Extract using regex (cho HTML đơn giản)
const titleMatch = html.match(/<title>(.*?)<\/title>/i);
const priceMatch = html.match(/class="price"[^>]*>([\d,.]+)/);
const descMatch = html.match(/class="description"[^>]*>([\s\S]*?)<\/div>/i);

return [{
  json: {
    title: titleMatch ? titleMatch[1].trim() : '',
    price: priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0,
    description: descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : ''
  }
}];
```

### API-based Extraction (Preferred)
```javascript
// Code node: Extract from JSON API (ưu tiên hơn HTML scraping)
const response = $json;

// Shopee-style API response
if (response.data && response.data.items) {
  return response.data.items.map(item => ({
    json: {
      name: item.name,
      price: item.price / 100000, // Shopee stores in smallest unit
      sold: item.historical_sold,
      rating: item.item_rating?.rating_star || 0,
      shop: item.shopee_verified ? 'verified' : 'normal',
      url: `https://shopee.vn/product/${item.shopid}/${item.itemid}`
    }
  }));
}
return [{ json: { error: 'Unexpected format' } }];
```

## Rate Limiting for Scraping

```
Data Sources (Sheets: URL list)
  → SplitInBatches (batch: 1)
  → HTTP Request (scrape)
  → Wait (2-5 seconds random delay)
  → Code (process data)
  → Loop back
```

```javascript
// Code node: Random delay calculation
const minDelay = 2000;
const maxDelay = 5000;
const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
return [{ json: { ...($json), _delay: delay } }];
```

## Data Cleaning Patterns

```javascript
// Code node: Clean & normalize scraped data
const items = $input.all();
return items.map(item => {
  const d = item.json;
  return {
    json: {
      // Normalize text
      name: (d.name || '').trim().replace(/\s+/g, ' '),
      // Parse price (handle: "1.200.000₫", "$1,200", "1200000")
      price: parseFloat(String(d.price || '0').replace(/[₫$,.\s]/g, '').replace(/(\d)(?=\d{3}$)/, '$1.')) || 0,
      // Normalize date
      date: d.date ? new Date(d.date).toISOString() : new Date().toISOString(),
      // Clean HTML
      description: (d.description || '').replace(/<[^>]*>/g, '').trim(),
      // Source tracking
      _source: d._source || 'unknown',
      _scrapedAt: new Date().toISOString()
    }
  };
}).filter(item => item.json.name); // Remove empty
```

## Data Pipeline: Collect → Clean → Store → Analyze

```
[Collect]
Schedule → Multiple HTTP Requests → Merge all data

[Clean]
→ Code (normalize, deduplicate)
→ Filter (remove invalid entries)

[Store]
→ Google Sheets (raw data)
→ Google Sheets (cleaned data)

[Analyze]
Schedule (weekly)
→ Sheets (read all data)
→ AI Agent (trend analysis, insights, recommendations)
→ Sheets (analysis report)
→ Telegram (weekly insights)
```

## Best Practices

```
✅ Dùng API chính thức khi có thể (ổn định, hợp pháp)
✅ Rate limit: max 1 request/2-5 giây cho scraping
✅ Set User-Agent header rõ ràng
✅ Cache kết quả để tránh duplicate requests
✅ Error handling cho mỗi HTTP Request
✅ Log mỗi scrape session vào Sheets (audit trail)
✅ Dùng AI để extract structured data từ unstructured HTML

❌ KHÔNG scrape quá nhanh (sẽ bị block)
❌ KHÔNG scrape dữ liệu cá nhân / private data
❌ KHÔNG ignore robots.txt
❌ KHÔNG store raw HTML lâu dài (chỉ store extracted data)
❌ KHÔNG hardcode selectors (HTML thay đổi → workflow vỡ)
```
