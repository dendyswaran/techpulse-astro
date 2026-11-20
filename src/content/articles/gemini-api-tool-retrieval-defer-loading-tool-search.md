---
title: "Gemini API Adds Tool Retrieval: Agents Load Tool Schemas Only When They Need Them"
subtitle: "Google put Tool Retrieval into preview in the Gemini Interactions API on November 19, 2026. Add a tool_search tool, mark rarely used tools defer_loading: true, and the model sees only their names and descriptions until it asks for one. There's no extra fee, it works with remote MCP servers, and Google says it keeps the cached prompt prefix stable."
pubDate: 2026-11-20
category: "ai"
tags: ["Gemini API", "Google", "Agents", "Tool Calling", "MCP", "Token Cost", "Prompt Caching"]
readingTime: "4 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/gemini-api-tool-retrieval-defer-loading-tool-search.webp"
coverAlt: "Muted editorial illustration of a tall card-catalog cabinet with every drawer closed except one, pulled halfway out under a small pool of warm light"
coverCaption: "Illustration by TechPulse Editorial · Keep the drawers shut until you need one."
tldr:
  - "On November 19, 2026, Google launched Tool Retrieval in preview in the Gemini Interactions API. The model sees the name and description of every deferred tool, but full parameter schemas stay out of context until the model asks for a tool by name."
  - "To turn it on, add a tool_search tool to the request and set defer_loading: true on the tools to hold back. In server-side mode, the search, the schema load and the function call all happen inside the same request. Setting defer_loading on an mcp_server tool defers every tool that server exposes."
  - "There's no separate charge. tool_search adds a small fixed block of input tokens, and each loaded schema is billed as input for the rest of the conversation. Google says loaded schemas are appended later in the conversation, so the cached prefix doesn't change. It works with Gemini 3.6 and later, including all Gemini 4 models."
  - "Teams with their own tool registry or permission filter can run the search client-side with execution: client, at the cost of one extra round trip per search."
sources:
  - label: "Google — Introducing Tool Retrieval in the Gemini API (Nov 19, 2026)"
    url: "https://blog.google/innovation-and-ai/technology/developers-tools/gemini-api-tool-retrieval/"
  - label: "Google AI Studio — Interactions API: Creating an interaction"
    url: "https://aistudio.google.com/api-reference/interactions-api/create-interaction"
  - label: "PPC Land — Google shrinks idle tools in Gemini agents"
    url: "https://ppc.land/google-shrinks-idle-tools-in-gemini-agents-to-about-26-tokens-each/"
---

Agents that connect to many tools pay a quiet tax: every full parameter schema goes out with every request. Google's announcement names three costs: higher input token counts, extra latency and **lower tool-selection accuracy** as the list grows. On **November 19, 2026**, Google shipped its answer, **Tool Retrieval**, in preview in the **Gemini Interactions API**.

## How it works

Two changes to the request:

1. Add `{"type": "tool_search"}` to `tools`.
2. Set `"defer_loading": true` on the tools you want held back.

The model still sees **the name and description of every deferred tool**, so it knows what exists. The parameter schemas stay out. When the model needs a tool, it asks for it by name, the API loads the schema, and the model makes the call. In the default **server-side** mode, all three steps happen **inside one request**:

```python
tools = [
    {"type": "tool_search"},
    {
        "type": "function",
        "name": "issue_refund",
        "description": "Refund an order to the original payment method.",
        "defer_loading": True,
        "parameters": {...},
    },
    # ... long tail of other deferred functions; keep frequent tools undeferred
]

interaction = client.interactions.create(
    model="gemini-4-hydrogen",
    input="Order A-1042 arrived damaged. Please refund 40 dollars.",
    tools=tools,
)
```

The response's `interaction.steps` shows a `tool_search_call`, a `tool_search_result` with the loaded schema, and then a normal `function_call`. Google suggests using those steps to debug tool names and descriptions. Your code still runs the function and sends back a `function_result`.

Google says there's "no index to build or host." Its advice is to keep your **most-used tools loaded up front** and defer the long tail.

## MCP servers and client-side search

- **Remote MCP servers:** set `defer_loading: true` on an `mcp_server` tool and *every* tool that server exposes loads on demand. You don't have to list them one by one.
- **Client-side retrieval:** if you already have a tool registry, embedding index or per-user permission filter, declare `tool_search` with `"execution": "client"` and your own parameters. The model calls your search function, and you return matching function declarations in a `function_result`. That costs **one extra round trip per search**, but it lets you add tools mid-conversation, for example when a user connects a new integration.

## Cost and caching

- **No separate charge.** Tokens are billed at the model's normal rates.
- Turning on `tool_search` adds **a small, fixed block of input tokens**. Each schema the model loads is billed as input **for the rest of the conversation**, the same as a tool declared up front.
- You come out ahead when the schemas you never load outweigh the ones you do. Google's advice is to measure against your own traffic.
- **Prefix caching:** deferred schemas aren't at the start of the prompt, and loaded ones are appended later in the conversation, so Google says "the cached prefix stays the same from turn to turn."

PPC Land points out that the design closely follows similar deferred-tool features Anthropic and OpenAI shipped earlier, down to the name of the flag.

## Availability

Tool Retrieval is a **preview** feature of the **Interactions API** only. It works with **Gemini 3.6 and later**, including all Gemini 4 models. Google gave no general-availability date and published no benchmark figures for the savings.

## Why it matters

The usual MCP setup just pastes every server's full tool list into context. For agents with large tool catalogs, Tool Retrieval turns that into a server-side flag. The trade-off is that your **tool names and descriptions now do the selecting**, so write them carefully. Vague descriptions will hurt more than before.
