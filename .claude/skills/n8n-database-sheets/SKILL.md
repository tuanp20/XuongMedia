---
name: n8n-database-sheets
description: Tích hợp Database và Google Sheets trong n8n - Postgres, MySQL, Supabase, Google Sheets, Airtable. Kích hoạt khi user yêu cầu đọc/ghi database, Google Sheets, lưu trữ data, hoặc sync dữ liệu.
---

# n8n Database & Sheets Integration - Expert Skill

Bạn là chuyên gia tích hợp database và spreadsheet trong n8n. Tối ưu query, sync data, và thiết kế data pipeline.

## Database Nodes (Active)

| Node | Type | Dùng khi |
|------|------|----------|
| `n8n-nodes-base.postgres` | SQL | Production DB, complex queries |
| `n8n-nodes-base.mySql` | SQL | Legacy systems |
| `n8n-nodes-base.googleSheets` | Spreadsheet | Lightweight data, shared access |
| `@n8n/n8n-nodes-langchain.memoryPostgresChat` | AI Memory | Chat history cho AI Agent |
| `n8n-nodes-base.supabaseVectorStore` | Vector DB | RAG, embeddings |
| `n8n-nodes-base.redis` | Key-Value | Cache, session |
| `n8n-nodes-base.mongoDb` | Document | Flexible schema |
| `n8n-nodes-base.airtable` | Spreadsheet+ | Structured data with API |

## Google Sheets Patterns

### Read Sheet
```json
{
  "parameters": {
    "operation": "read",
    "documentId": {"mode": "url", "value": "https://docs.google.com/spreadsheets/d/SHEET_ID"},
    "sheetName": {"mode": "list", "value": "Sheet1"},
    "options": {
      "range": "A:Z",
      "dataLocationOnSheet": {"rangeDefinition": "detectAutomatically"}
    }
  },
  "type": "n8n-nodes-base.googleSheets",
  "typeVersion": 4.5
}
```

### Append Row
```json
{
  "parameters": {
    "operation": "append",
    "documentId": {"mode": "url", "value": "={{ $vars.SHEET_URL }}"},
    "sheetName": {"mode": "list", "value": "Orders"},
    "columns": {
      "mappingMode": "defineBelow",
      "value": {
        "OrderID": "={{ $json.orderId }}",
        "Customer": "={{ $json.customerName }}",
        "Amount": "={{ $json.amount }}",
        "Date": "={{ $now.format('yyyy-MM-dd HH:mm') }}",
        "Status": "pending"
      }
    }
  },
  "type": "n8n-nodes-base.googleSheets",
  "typeVersion": 4.5
}
```

### Update Row (by filter)
```json
{
  "parameters": {
    "operation": "update",
    "documentId": {"mode": "url", "value": "={{ $vars.SHEET_URL }}"},
    "sheetName": {"mode": "list", "value": "Orders"},
    "columns": {
      "mappingMode": "defineBelow",
      "value": {
        "Status": "completed",
        "CompletedAt": "={{ $now.toISO() }}"
      }
    },
    "options": {
      "cellFormat": "USER_ENTERED"
    },
    "filtersUI": {
      "values": [{"lookupColumn": "OrderID", "lookupValue": "={{ $json.orderId }}"}]
    }
  },
  "type": "n8n-nodes-base.googleSheets",
  "typeVersion": 4.5
}
```

### Lookup (tìm row)
```json
{
  "parameters": {
    "operation": "read",
    "documentId": {"mode": "url", "value": "={{ $vars.SHEET_URL }}"},
    "sheetName": {"mode": "list", "value": "Products"},
    "filtersUI": {
      "values": [{"lookupColumn": "SKU", "lookupValue": "={{ $json.sku }}"}]
    }
  },
  "type": "n8n-nodes-base.googleSheets",
  "typeVersion": 4.5
}
```

## Postgres Patterns

### Select Query
```json
{
  "parameters": {
    "operation": "select",
    "table": {"value": "users", "mode": "list"},
    "where": {
      "values": [
        {"column": "status", "value": "active"},
        {"column": "created_at", "operator": "gt", "value": "={{ $now.minus({days: 7}).toISO() }}"}
      ]
    },
    "sort": {"values": [{"column": "created_at", "direction": "DESC"}]},
    "limit": 50,
    "options": {}
  },
  "type": "n8n-nodes-base.postgres",
  "typeVersion": 2.5
}
```

### Insert
```json
{
  "parameters": {
    "operation": "insert",
    "table": {"value": "orders", "mode": "list"},
    "columns": {
      "mappingMode": "defineBelow",
      "value": {
        "user_id": "={{ $json.userId }}",
        "product_id": "={{ $json.productId }}",
        "amount": "={{ $json.amount }}",
        "status": "pending",
        "created_at": "={{ $now.toISO() }}"
      }
    }
  },
  "type": "n8n-nodes-base.postgres",
  "typeVersion": 2.5
}
```

### Custom Query (khi cần JOIN, aggregate)
```json
{
  "parameters": {
    "operation": "executeQuery",
    "query": "SELECT o.id, o.amount, u.name, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = $1 AND o.created_at > $2 ORDER BY o.created_at DESC LIMIT $3",
    "options": {
      "queryReplacement": "={{ ['pending', $now.minus({days: 30}).toISO(), 100] }}"
    }
  },
  "type": "n8n-nodes-base.postgres",
  "typeVersion": 2.5
}
```

## Data Sync Patterns

### Pattern 1: Google Sheets → Database (Import)
```
Schedule Trigger (daily)
  → Google Sheets (read all)
  → Code (transform/validate)
  → Postgres (upsert)
  → Slack (notify done)
```

### Pattern 2: Database → Google Sheets (Report)
```
Schedule Trigger (hourly)
  → Postgres (SELECT report query)
  → Set (format columns)
  → Google Sheets (clear + write)
```

### Pattern 3: Two-way Sync
```
[Sheet → DB]
Google Sheets Trigger (on change)
  → Filter (new/updated rows)
  → Postgres (upsert)

[DB → Sheet]
Postgres Trigger (on insert/update)
  → Google Sheets (update row by ID)
```

### Pattern 4: Data Pipeline
```
Multiple Sources → Merge → Transform → Load
  ├── Google Sheets (product catalog)
  ├── Postgres (order data)
  └── HTTP Request (exchange rates)
  → Merge (combine by key)
  → Code (calculate metrics)
  → Google Sheets (write dashboard)
```

## Google Sheets as Mini Database

Phù hợp khi:
- Data < 10,000 rows
- Cần share cho non-tech team
- Prototype/MVP nhanh
- Không cần complex queries

**Sheet structure chuẩn:**
```
| ID | Name | Email | Status | CreatedAt | UpdatedAt |
|----|------|-------|--------|-----------|-----------|
```

- Row 1 = Headers (KHÔNG được trống)
- Column A = Unique ID
- Dates format: `yyyy-MM-dd HH:mm:ss`

## Credential Setup

### Google Sheets
```
1. Google Cloud Console → Create Project
2. Enable Google Sheets API + Google Drive API
3. Create OAuth 2.0 credentials
4. n8n → Credentials → Google Sheets OAuth2 API
5. Authorize
```

### Postgres
```
1. n8n → Credentials → Postgres
2. Host: your-db-host.com
3. Port: 5432
4. Database: your_db
5. User: your_user
6. Password: your_pass
7. SSL: Enable for production
```

## Best Practices

```
✅ Dùng parameterized queries ($1, $2) → tránh SQL injection
✅ Set LIMIT khi SELECT → tránh quá tải
✅ Dùng upsert thay insert → tránh duplicate
✅ Google Sheets: dùng cellFormat "USER_ENTERED" → auto-parse dates/numbers
✅ Index columns thường query trong Postgres
✅ Batch operations khi > 100 rows

❌ KHÔNG hardcode credentials trong workflow
❌ KHÔNG SELECT * FROM large_table không có WHERE
❌ KHÔNG dùng Google Sheets cho > 50k rows
❌ KHÔNG quên error handling cho DB operations
```
