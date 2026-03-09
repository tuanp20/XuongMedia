---
name: n8n-ai-agent
description: Xây dựng AI Agent workflows trong n8n - Anthropic/OpenAI models, tools, memory, RAG, chatbot. Kích hoạt khi user yêu cầu tạo AI agent, chatbot, xử lý ngôn ngữ, hoặc tích hợp LLM.
---

# n8n AI Agent Builder - Expert Skill

Bạn là chuyên gia xây dựng AI Agent workflows trong n8n, hiểu sâu về LangChain integration, tool-calling, memory management, và RAG patterns.

## AI Node Hierarchy (n8n LangChain)

```
AI Agent (Root)
├── Chat Model (required)
│   ├── Anthropic Chat Model ⭐ (claude-sonnet-4-20250514, claude-haiku-4-5-20251001)
│   ├── OpenAI Chat Model (gpt-4o, gpt-4o-mini)
│   ├── Groq Chat Model (llama, mixtral - free/fast)
│   └── Ollama Chat Model (local models)
├── Memory (optional)
│   ├── Window Buffer Memory (last N messages)
│   ├── Postgres Chat Memory ⭐ (persistent, scalable)
│   ├── Redis Chat Memory (fast, session-based)
│   ├── Motorhead Memory (managed service)
│   └── Zep Memory (long-term + summary)
├── Tools (optional, multiple)
│   ├── Calculator
│   ├── Code Tool (custom JS/Python)
│   ├── HTTP Request Tool ⭐
│   ├── Google Sheets Tool
│   ├── Postgres Tool
│   ├── Wikipedia
│   ├── SerpAPI / Google Search
│   ├── Workflow Tool ⭐ (gọi sub-workflow)
│   └── Vector Store Tool (RAG)
└── Output Parser (optional)
    ├── Structured Output Parser (JSON schema)
    ├── Auto-fixing Output Parser
    └── Item List Output Parser
```

## Agent Types

### Tools Agent (Khuyên dùng)
```json
{
  "parameters": {
    "options": {
      "systemMessage": "You are a helpful assistant...",
      "maxIterations": 10,
      "returnIntermediateSteps": false
    }
  },
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 1.7
}
```
- Hỗ trợ tool-calling (function calling)
- Phù hợp với Claude và GPT-4o
- Có thể gọi nhiều tools trong 1 turn

### Conversational Agent
- Dùng cho chatbot đơn giản
- Không cần tool-calling phức tạp

## Patterns AI Agent

### Pattern 1: Chatbot + Memory + Tools
```
Chat Trigger
  → AI Agent (Tools Agent)
    ├── Anthropic Chat Model (claude-sonnet)
    ├── Postgres Chat Memory (sessionId = chatId)
    ├── HTTP Request Tool (gọi API)
    ├── Google Sheets Tool (đọc/ghi data)
    └── Code Tool (custom logic)
```

**Workflow JSON mẫu:**
```json
{
  "nodes": [
    {
      "parameters": {},
      "name": "Chat Trigger",
      "type": "@n8n/n8n-nodes-langchain.chatTrigger",
      "typeVersion": 1.1,
      "position": [0, 0]
    },
    {
      "parameters": {
        "options": {
          "systemMessage": "=Bạn là trợ lý AI thông minh. Trả lời ngắn gọn, chính xác.",
          "maxIterations": 5
        }
      },
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [200, 0]
    },
    {
      "parameters": {
        "model": "claude-sonnet-4-20250514",
        "options": {
          "maxTokensToSample": 2048,
          "temperature": 0.3
        }
      },
      "name": "Anthropic",
      "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic",
      "typeVersion": 1.2,
      "position": [100, 200]
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "={{ $json.chatId }}"
      },
      "name": "Postgres Memory",
      "type": "@n8n/n8n-nodes-langchain.memoryPostgresChat",
      "typeVersion": 1.3,
      "position": [250, 200]
    }
  ],
  "connections": {
    "Chat Trigger": {"main": [[{"node": "AI Agent", "type": "main", "index": 0}]]},
    "Anthropic": {"ai_languageModel": [[{"node": "AI Agent", "type": "ai_languageModel", "index": 0}]]},
    "Postgres Memory": {"ai_memory": [[{"node": "AI Agent", "type": "ai_memory", "index": 0}]]}
  }
}
```

### Pattern 2: AI Data Processor
```
Trigger → Fetch Data → AI Agent (Summarize/Classify) → Save to DB → Notify
```
- Dùng Structured Output Parser để AI trả JSON chuẩn
- Không cần memory (stateless)

### Pattern 3: RAG (Retrieval Augmented Generation)
```
[Ingest Pipeline]
Document → Text Splitter → Embeddings → Vector Store (Supabase/Pinecone)

[Query Pipeline]
Chat Trigger → AI Agent + Vector Store Tool → Response
```

### Pattern 4: Multi-Agent Chain
```
Trigger → Agent 1 (Research) → Agent 2 (Analyze) → Agent 3 (Write) → Output
```
- Mỗi agent có system prompt riêng
- Dùng Set node để pass context giữa agents

### Pattern 5: AI + Automation Combo
```
Form Trigger (user input)
  → AI Agent (phân tích yêu cầu)
    ├── Tool: Google Sheets (đọc data)
    ├── Tool: HTTP Request (gọi external API)
    └── Tool: Workflow Tool (trigger automation)
  → Switch (dựa trên AI output)
    ├── Action A (gửi email)
    ├── Action B (tạo task)
    └── Action C (update DB)
```

## System Prompt Engineering

```javascript
// Template system prompt cho AI Agent
const systemPrompt = `
Bạn là {role}.

## Nhiệm vụ
{task_description}

## Quy tắc
- Trả lời bằng tiếng Việt
- Ngắn gọn, đi thẳng vào vấn đề
- Khi cần data, dùng tools được cung cấp
- KHÔNG bịa thông tin, nếu không biết thì nói không biết

## Output Format
{format_instructions}

## Context
{relevant_context}
`;
```

## Structured Output Parser

```json
{
  "parameters": {
    "jsonSchema": "{\n  \"type\": \"object\",\n  \"properties\": {\n    \"category\": {\"type\": \"string\", \"enum\": [\"bug\", \"feature\", \"question\"]},\n    \"priority\": {\"type\": \"string\", \"enum\": [\"low\", \"medium\", \"high\"]},\n    \"summary\": {\"type\": \"string\"}\n  },\n  \"required\": [\"category\", \"priority\", \"summary\"]\n}"
  },
  "type": "@n8n/n8n-nodes-langchain.outputParserStructured",
  "typeVersion": 1.2
}
```

## Code Tool Pattern

```javascript
// Tool cho AI Agent gọi - ví dụ: tính giá
// Name: calculate_price
// Description: Tính giá sản phẩm với discount
const query = $fromAI("query", "product_id and quantity", "string");
const [productId, qty] = query.split(",");

// Logic xử lý
const price = getPrice(productId);
const total = price * parseInt(qty) * 0.9; // 10% discount

return { price: total, currency: "VND" };
```

## Workflow Tool Pattern (Sub-workflow as Tool)

```json
{
  "parameters": {
    "name": "search_database",
    "description": "Search the product database by keyword. Returns list of matching products with price and stock.",
    "workflowId": "={{ $vars.searchWorkflowId }}"
  },
  "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
  "typeVersion": 2
}
```

## Memory Best Practices

| Loại | Khi nào dùng | Session Key |
|------|-------------|-------------|
| Window Buffer | Chat đơn giản, không cần lưu lâu | `chatId` |
| Postgres | Production, cần persistent | `userId` hoặc `chatId` |
| Redis | High-traffic, session ngắn | `sessionId` |

**Session Key quan trọng** - dùng unique identifier:
```
={{ $json.chatId }}          // Telegram chat
={{ $json.userId }}          // User-specific
={{ $json.sessionId }}       // Custom session
={{ $json.email }}           // Email-based
```

## Model Selection Guide

| Model | Dùng khi | Cost |
|-------|----------|------|
| claude-sonnet-4 | Tool-calling, phân tích phức tạp | $$$ |
| claude-haiku-4-5 | Chat nhanh, classify, extract | $ |
| gpt-4o | Đa năng, vision | $$$ |
| gpt-4o-mini | Budget, tasks đơn giản | $ |
| llama-3.1-70b (Groq) | Free tier, prototype | Free |

## Credentials cần thiết

```
Anthropic API Key → Settings → Credentials → Anthropic Account
OpenAI API Key → Settings → Credentials → OpenAI Account
Postgres → Settings → Credentials → Postgres
```

## Anti-Patterns (TRÁNH)

```
❌ maxIterations quá cao (>15) → tốn token, chậm
❌ System prompt quá dài → giảm context window
❌ Không set temperature → mặc định 1.0, output không ổn định
❌ Không dùng memory cho chatbot → mất ngữ cảnh
❌ Dùng AI cho task đơn giản → overkill, dùng Code/Set node thay
❌ Không validate AI output → dùng Structured Output Parser
```
