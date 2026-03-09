---
name: n8n-automation-patterns
description: Patterns và best practices cho n8n automation - error handling, optimization, sub-workflow, data transform, testing. Kích hoạt khi user yêu cầu tối ưu workflow, xử lý lỗi, debug, hoặc cần pattern phức tạp.
---

# n8n Automation Patterns - Expert Skill

Bạn là chuyên gia tối ưu workflow n8n. Focus vào tốc độ, reliability, và maintainability.

## Error Handling Patterns

### Global Error Handler
```
Error Trigger (catches all workflow errors)
  → Set (extract error info)
  → Switch (severity)
    ├── critical → Telegram (alert admin) + Google Sheets (log)
    ├── warning → Google Sheets (log only)
    └── info → NoOp
```

```json
{
  "parameters": {},
  "type": "n8n-nodes-base.errorTrigger",
  "typeVersion": 1,
  "position": [0, 0]
}
```

### Try-Catch Pattern
```
Trigger → Code (try block)
  → If (success?)
    ├── true → Continue
    └── false → Error Handler → Retry/Alert
```

### Retry with Exponential Backoff
```javascript
// Code node: Retry logic
const maxRetries = 3;
const currentRetry = $json.retryCount || 0;

if (currentRetry >= maxRetries) {
  throw new Error(`Failed after ${maxRetries} retries: ${$json.lastError}`);
}

const delay = Math.pow(2, currentRetry) * 1000; // 1s, 2s, 4s
return [{
  json: {
    ...($json),
    retryCount: currentRetry + 1,
    retryDelay: delay
  }
}];
```

## Sub-Workflow Architecture

### Khi nào dùng Sub-Workflow
- Logic dùng lại ở nhiều workflow
- Workflow quá phức tạp (>20 nodes)
- Cần isolate error handling
- Team collaboration (mỗi người 1 sub-workflow)

### Main → Sub-Workflow
```json
{
  "parameters": {
    "source": "database",
    "workflowId": "={{ $vars.processOrderWorkflowId }}",
    "mode": "each",
    "options": {}
  },
  "type": "n8n-nodes-base.executeWorkflow",
  "typeVersion": 1.2
}
```

### Sub-Workflow nhận + trả data
```
[Sub-Workflow]
Execute Workflow Trigger → Process Data → Set (output) → [auto return]

[Main Workflow]
... → Execute Workflow (call sub) → tiếp tục với data trả về
```

## Data Transform Patterns

### Flatten Nested JSON
```javascript
// Code node
const items = $input.all();
return items.map(item => ({
  json: {
    id: item.json.id,
    name: item.json.user.profile.name,
    email: item.json.user.contact.email,
    city: item.json.user.address.city
  }
}));
```

### Group By
```javascript
// Code node: Group items by category
const items = $input.all();
const groups = {};

items.forEach(item => {
  const key = item.json.category;
  if (!groups[key]) groups[key] = [];
  groups[key].push(item.json);
});

return Object.entries(groups).map(([category, items]) => ({
  json: { category, items, count: items.length }
}));
```

### Deduplicate
```javascript
// Code node: Remove duplicates by field
const items = $input.all();
const seen = new Set();
return items.filter(item => {
  const key = item.json.email; // dedupe field
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
```

### Merge Multiple Sources
```
[Source A] ──┐
[Source B] ──┤→ Merge (combine by key) → Process
[Source C] ──┘
```

Merge modes:
- `append` - Gộp tất cả items
- `combineByPosition` - Ghép theo index
- `combineByFields` - Ghép theo field match (JOIN)
- `chooseBranch` - Chọn 1 nhánh

## Performance Optimization

### 1. Minimize Nodes
```
❌ Set → Set → Set (3 nodes)
✅ Set (all fields in 1 node)

❌ Code → If → Code
✅ Code (handle logic + condition internally)
```

### 2. Use Expressions Over Code Node
```
❌ Code node: return [{ json: { upper: $json.name.toUpperCase() } }]
✅ Set node: {{ $json.name.toUpperCase() }}
```

### 3. Batch Processing
```
Large dataset (10k items)
  → SplitInBatches (100 per batch)
  → Process batch
  → Loop back
```

### 4. Parallel Execution
```
Trigger → Split data into chunks
  ├── Execute Workflow (chunk 1)
  ├── Execute Workflow (chunk 2)
  └── Execute Workflow (chunk 3)
  → Merge results
```

### 5. Caching
```javascript
// Code node: Simple cache with static variable
const cacheKey = 'exchange_rates';
const cached = $getWorkflowStaticData('global');

if (cached[cacheKey] && Date.now() - cached[`${cacheKey}_ts`] < 3600000) {
  return [{ json: cached[cacheKey] }];
}

// If not cached, continue to HTTP Request
return [{ json: { needsFetch: true } }];
```

## Common Workflow Templates

### Template 1: Lead Capture → CRM
```
Form Trigger (capture lead)
  → AI Agent (qualify lead, extract intent)
  → Google Sheets (save lead)
  → If (qualified?)
    ├── true → Telegram (notify sales) + Gmail (send welcome)
    └── false → Gmail (send nurture email)
```

### Template 2: Content Pipeline
```
Schedule (daily 9am)
  → AI Agent (generate content ideas)
  → Code (format for platforms)
  → Split (by platform)
    ├── Telegram (post to channel)
    ├── Slack (share with team)
    └── Google Sheets (content calendar)
```

### Template 3: Order Processing
```
Webhook (new order)
  → Validate → Google Sheets (save order)
  → AI Agent (categorize, estimate delivery)
  → Telegram (notify admin)
  → Wait (approval webhook)
  → If (approved?)
    ├── true → Process → Gmail (confirm to customer)
    └── false → Gmail (reject notification)
```

### Template 4: Monitoring & Alerts
```
Schedule (every 5 min)
  → HTTP Request (health check endpoints)
  → If (any failed?)
    ├── true → Telegram (alert) + Google Sheets (incident log)
    └── false → NoOp
```

### Template 5: Data Sync Pipeline
```
Schedule (hourly)
  → Postgres (SELECT new/updated)
  → Filter (changed since last sync)
  → Google Sheets (upsert rows)
  → Set (update lastSync timestamp)
  → Postgres (UPDATE lastSync)
```

## Testing Strategy

### 1. Manual Trigger First
- Mọi workflow phải test được bằng Manual Trigger
- Mock data bằng Set node ở đầu

### 2. Test Sub-Workflows Independently
```
Manual Trigger → Mock Input → Sub-Workflow Logic → Verify Output
```

### 3. Staging Environment
```
$vars.ENVIRONMENT = "staging" | "production"
$vars.API_BASE_URL = staging? "https://staging.api.com" : "https://api.com"
$vars.NOTIFY_CHAT_ID = staging? "dev_chat" : "prod_chat"
```

### 4. Logging
```javascript
// Code node: Structured logging
const logEntry = {
  timestamp: new Date().toISOString(),
  workflow: $workflow.name,
  execution: $execution.id,
  step: 'process_order',
  data: { orderId: $json.orderId, status: 'processed' }
};
console.log(JSON.stringify(logEntry));
return $input.all();
```

## Naming Conventions

```
Workflows:  [Category] Action - Description
            [Orders] Process New Order
            [AI] Content Generator - Daily Posts
            [Sync] Sheets → Postgres - Hourly

Nodes:      Action + Target
            Fetch Orders
            Validate Input
            Send Notification
            Save to DB

Variables:  UPPER_SNAKE_CASE
            API_BASE_URL
            ADMIN_CHAT_ID
            SHEET_URL

Credentials: Service - Purpose
             Google Sheets - Main Store
             Postgres - Production DB
             Telegram - Bot XuongMedia
```

## Anti-Patterns (TRÁNH)

```
❌ Workflow > 30 nodes → Tách thành sub-workflows
❌ Hardcode giá trị → Dùng $vars hoặc $env
❌ Không có Error Trigger → Luôn thêm global error handler
❌ Dùng Wait node quá lâu (>24h) → Dùng webhook callback
❌ Duplicate logic → Tạo sub-workflow dùng chung
❌ Không test trước khi activate → Luôn Manual Trigger test
❌ Quá nhiều Code nodes → Dùng built-in nodes khi có thể
```
