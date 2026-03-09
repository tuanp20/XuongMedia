---
name: n8n-trigger-scheduler
description: Trigger và Scheduler trong n8n - webhook, cron, form trigger, event-driven. Kích hoạt khi user yêu cầu tạo trigger, lập lịch chạy tự động, webhook endpoint, hoặc form thu thập dữ liệu.
---

# n8n Trigger & Scheduler - Expert Skill

Chuyên gia thiết kế trigger, webhook, scheduler và event-driven workflows trong n8n.

## Trigger Nodes (Active - 2025)

### Core Triggers
| Node | Khi nào dùng | TypeVersion |
|------|-------------|-------------|
| `webhook` | Nhận HTTP request từ bên ngoài | 2 |
| `scheduleTrigger` | Chạy định kỳ (cron) | 1.2 |
| `manualTrigger` | Test thủ công | 1 |
| `formTrigger` | Form nhập liệu (có UI) | 2.2 |
| `chatTrigger` | AI chatbot interface | 1.1 |
| `executeWorkflowTrigger` | Được gọi từ workflow khác | 1.1 |
| `emailReadImap` | Nhận email mới | 2.2 |

### App Triggers (phổ biến)
| Node | Event |
|------|-------|
| `googleSheetsTrigger` | Row added/updated trong Google Sheets |
| `telegramTrigger` | Message/callback từ Telegram bot |
| `githubTrigger` | Push, PR, issue events |
| `slackTrigger` | New message in channel |
| `stripeTrigger` | Payment, subscription events |

## Webhook Patterns

### Basic Webhook
```json
{
  "parameters": {
    "path": "my-endpoint",
    "httpMethod": "POST",
    "responseMode": "responseNode",
    "options": {}
  },
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2,
  "webhookId": "unique-id"
}
```

### Webhook + Validate + Respond
```
Webhook (POST /api/order)
  → If (validate payload)
    ├── true → Process → Respond (200 OK)
    └── false → Respond (400 Bad Request)
```

```json
{
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ JSON.stringify({ success: true, orderId: $json.id }) }}",
    "options": {
      "responseCode": 200,
      "responseHeaders": {
        "entries": [{"name": "Content-Type", "value": "application/json"}]
      }
    }
  },
  "type": "n8n-nodes-base.respondToWebhook",
  "typeVersion": 1.1
}
```

### Webhook Authentication
```json
{
  "parameters": {
    "path": "secure-endpoint",
    "authentication": "headerAuth",
    "httpMethod": "POST",
    "responseMode": "responseNode"
  },
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2
}
```

Options:
- `none` - Public
- `basicAuth` - Username/Password
- `headerAuth` - API Key in header
- `jwtAuth` - JWT token

## Schedule Trigger Patterns

### Cron Expressions
```json
{
  "parameters": {
    "rule": {
      "interval": [{"field": "cronExpression", "expression": "0 9 * * 1-5"}]
    }
  },
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1.2
}
```

**Common Cron:**
```
"0 */5 * * * *"     → Mỗi 5 phút
"0 0 * * * *"       → Mỗi giờ
"0 0 9 * * *"       → 9h sáng mỗi ngày
"0 0 9 * * 1-5"     → 9h sáng T2-T6
"0 0 0 * * *"       → 0h mỗi ngày (midnight)
"0 0 0 1 * *"       → 0h ngày 1 mỗi tháng
"0 0 9,18 * * *"    → 9h và 18h mỗi ngày
```

### Simple Interval
```json
{
  "parameters": {
    "rule": {
      "interval": [{"field": "minutes", "minutesInterval": 30}]
    }
  },
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1.2
}
```

## Form Trigger

```json
{
  "parameters": {
    "formTitle": "Đăng ký dịch vụ",
    "formDescription": "Điền thông tin để đăng ký",
    "formFields": {
      "values": [
        {"fieldLabel": "Họ tên", "fieldType": "text", "requiredField": true},
        {"fieldLabel": "Email", "fieldType": "email", "requiredField": true},
        {"fieldLabel": "Gói dịch vụ", "fieldType": "dropdown", "fieldOptions": {"values": [{"option": "Basic"}, {"option": "Pro"}, {"option": "Enterprise"}]}},
        {"fieldLabel": "Ghi chú", "fieldType": "textarea", "requiredField": false}
      ]
    },
    "options": {
      "respondWithOptions": {
        "values": {"formSubmittedText": "Cảm ơn! Chúng tôi sẽ liên hệ trong 24h."}
      }
    }
  },
  "type": "n8n-nodes-base.formTrigger",
  "typeVersion": 2.2
}
```

## Event-Driven Patterns

### Pattern 1: Telegram Bot Handler
```
Telegram Trigger (message/callback)
  → Switch ($json.message vs $json.callback_query)
    ├── message → Code (parse command) → Handle
    └── callback → Code (parse data) → Handle
  → Telegram (send response)
```

### Pattern 2: Google Sheets as Event Source
```
Google Sheets Trigger (row added)
  → Filter (status = "new")
  → AI Agent (process request)
  → Google Sheets (update status = "processed")
  → Telegram (notify admin)
```

### Pattern 3: Multi-Event Webhook
```
Webhook (POST /events)
  → Switch ($json.event_type)
    ├── "order.created" → Process order
    ├── "payment.success" → Update payment
    ├── "user.registered" → Welcome email
    └── default → Log unknown event
```

### Pattern 4: Polling → Event (cho API không có webhook)
```
Schedule (every 5 min)
  → HTTP Request (GET /api/data)
  → Code (compare with last check)
  → If (new data found)
    ├── true → Process + Save last check timestamp
    └── false → NoOp
```

## Wait Node (Pause & Resume)

```json
{
  "parameters": {
    "resume": "webhook",
    "options": {
      "webhookSuffix": "/approve/{{ $json.requestId }}"
    }
  },
  "type": "n8n-nodes-base.wait",
  "typeVersion": 1.1
}
```

**Use case:** Approval flow
```
Form → Create Request → Send Approval Link → Wait (webhook)
  → User clicks Approve/Reject link
  → If (approved) → Process → Notify
```

## Best Practices

```
✅ Webhook: Luôn dùng responseMode: "responseNode" → kiểm soát response
✅ Schedule: Set timezone trong n8n settings → tránh lệch giờ
✅ Form: Validate data ngay sau trigger → reject sớm
✅ Dùng Error Trigger → catch failures từ mọi workflow
✅ Rate limit webhook bằng If node + Redis counter

❌ KHÔNG để webhook public không có auth
❌ KHÔNG schedule quá dày (< 1 phút) → overload
❌ KHÔNG dùng Manual Trigger cho production workflow
❌ KHÔNG quên Respond to Webhook node → client bị timeout
```
