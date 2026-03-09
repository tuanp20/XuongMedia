---
name: n8n-api-integration
description: Tích hợp API bên ngoài trong n8n - HTTP Request, OAuth, app nodes (Telegram, Slack, Gmail, Notion). Kích hoạt khi user yêu cầu kết nối API, gọi external service, hoặc tích hợp ứng dụng.
---

# n8n API Integration - Expert Skill

Chuyên gia tích hợp API và app nodes trong n8n. HTTP Request patterns, OAuth flows, rate limiting.

## HTTP Request Node (Swiss Army Knife)

### GET Request
```json
{
  "parameters": {
    "method": "GET",
    "url": "https://api.example.com/data",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [
        {"name": "page", "value": "={{ $json.page }}"},
        {"name": "limit", "value": "50"}
      ]
    },
    "options": {
      "response": {"response": {"responseFormat": "json"}}
    }
  },
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2
}
```

### POST with JSON Body
```json
{
  "parameters": {
    "method": "POST",
    "url": "https://api.example.com/create",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify({ name: $json.name, email: $json.email, plan: 'pro' }) }}",
    "options": {}
  },
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2
}
```

### Upload File (multipart)
```json
{
  "parameters": {
    "method": "POST",
    "url": "https://api.example.com/upload",
    "sendBody": true,
    "contentType": "multipart-form-data",
    "bodyParameters": {
      "parameters": [
        {"parameterType": "formBinaryData", "name": "file", "inputDataFieldName": "data"}
      ]
    }
  },
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2
}
```

## App Nodes Phổ Biến (Active)

### Communication
| Node | Operations | TypeVersion |
|------|-----------|-------------|
| `telegram` | sendMessage, sendPhoto, sendDocument, editMessage, answerCallback | 1.2 |
| `slack` | message.post, channel.create, user.info | 2.2 |
| `gmail` | send, reply, getAll, addLabel | 2.1 |
| `discord` | message.send, channel.getAll | 2 |

### Productivity
| Node | Operations |
|------|-----------|
| `notion` | page.create, database.query, block.append |
| `googleCalendar` | event.create, event.getAll |
| `googleDrive` | file.upload, file.download, folder.create |
| `trello` | card.create, card.update, list.getAll |
| `todoist` | task.create, task.getAll, task.close |

### Business
| Node | Operations |
|------|-----------|
| `stripe` | charge.create, customer.create, subscription.getAll |
| `shopify` | order.getAll, product.create, customer.getAll |
| `hubspot` | contact.create, deal.create, ticket.create |
| `airtable` | record.create, record.getAll, record.update |

## Telegram Node Patterns

### Send Message
```json
{
  "parameters": {
    "operation": "sendMessage",
    "chatId": "={{ $json.chatId }}",
    "text": "={{ $json.messageText }}",
    "additionalFields": {
      "parse_mode": "MarkdownV2",
      "reply_markup": {
        "inline_keyboard": [
          [{"text": "Confirm", "callback_data": "confirm:{{ $json.id }}"}],
          [{"text": "Cancel", "callback_data": "cancel:{{ $json.id }}"}]
        ]
      }
    }
  },
  "type": "n8n-nodes-base.telegram",
  "typeVersion": 1.2
}
```

### Send Photo + Caption
```json
{
  "parameters": {
    "operation": "sendPhoto",
    "chatId": "={{ $json.chatId }}",
    "file": "={{ $json.imageUrl }}",
    "additionalFields": {
      "caption": "={{ $json.caption }}",
      "parse_mode": "HTML"
    }
  },
  "type": "n8n-nodes-base.telegram",
  "typeVersion": 1.2
}
```

## Authentication Patterns

### API Key (Header)
```json
{
  "parameters": {
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth"
  }
}
// Credential: Header Auth → Name: "Authorization", Value: "Bearer sk-xxx"
```

### OAuth 2.0
```json
{
  "parameters": {
    "authentication": "oAuth2Api"
  }
}
// Setup OAuth2 credential with clientId, clientSecret, authUrl, tokenUrl
```

### Custom Auth (trong HTTP Request)
```json
{
  "parameters": {
    "authentication": "genericCredentialType",
    "genericAuthType": "httpCustomAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {"name": "X-API-Key", "value": "={{ $credentials.apiKey }}"}
      ]
    }
  }
}
```

## Pagination Pattern

```
Manual Trigger
  → Set (page = 1, allData = [])
  → Loop:
    HTTP Request (GET /api?page={{ $json.page }})
    → Code (merge data, check hasMore)
    → If (hasMore)
      ├── true → Set (page + 1) → Loop back
      └── false → Output allData
```

**Code node cho pagination:**
```javascript
const currentData = $('HTTP Request').all();
const previousData = $('Set').first().json.allData || [];
const allData = [...previousData, ...currentData.map(i => i.json)];
const hasMore = currentData.length === 50; // page size

return [{
  json: {
    allData,
    page: $('Set').first().json.page + 1,
    hasMore
  }
}];
```

## Rate Limiting Pattern

```javascript
// Code node: Rate limiter
const RATE_LIMIT = 30; // requests per minute
const DELAY_MS = Math.ceil(60000 / RATE_LIMIT); // ~2000ms

const items = $input.all();
const results = [];

for (const item of items) {
  results.push(item);
  // n8n handles this via SplitInBatches + Wait node
}

return results;
```

**Better approach: SplitInBatches + Wait**
```
Data → SplitInBatches (batch size: 1)
  → HTTP Request
  → Wait (2 seconds)
  → Loop back to SplitInBatches
```

## Error Handling cho API

```
HTTP Request
  → If ({{ $json.statusCode }} >= 400)
    ├── true → Switch (status code)
    │   ├── 401 → Refresh token → Retry
    │   ├── 429 → Wait (exponential) → Retry
    │   ├── 500 → Log error → Alert admin
    │   └── default → Stop and Error
    └── false → Continue processing
```

## Webhook Relay (nhận webhook → forward)

```
Webhook (receive from Stripe)
  → Set (extract relevant fields)
  → HTTP Request (POST to your API)
  → Google Sheets (log event)
  → Respond to Webhook (200 OK)
```

## Best Practices

```
✅ Dùng App Node khi có sẵn → ít config, auto-handle auth
✅ HTTP Request chỉ khi không có app node hoặc cần custom
✅ Luôn set timeout cho HTTP Request (default 300s quá dài)
✅ Log API responses vào Google Sheets để debug
✅ Dùng $vars cho base URLs → dễ switch env

❌ KHÔNG hardcode API keys trong workflow JSON
❌ KHÔNG gọi API loop không có rate limit
❌ KHÔNG ignore error responses → check statusCode
❌ KHÔNG dùng deprecated nodes (Function, FunctionItem)
```
