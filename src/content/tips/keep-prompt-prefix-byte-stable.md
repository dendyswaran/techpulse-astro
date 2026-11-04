---
title: "Keep the prompt prefix byte-stable so cache hits survive"
description: "Prompt caches match on an exact prefix. A timestamp, a rotating session id, or dynamic tools at the top of the system prompt quietly forces a full-price rebuild on every call."
pubDate: 2026-11-04T11:00:00+07:00
tags: ["prompt-caching", "token-cost", "agents", "anthropic", "openai"]
difficulty: beginner
author:
  name: Mazzden
sources:
  - handle: "amitsinha__07"
    platform: x
    url: "https://x.com/amitsinha__07/status/2116507478254878751"
    note: "Original tip: a timestamp at the top of the system prompt kills prompt caching"
  - handle: "yatharth170699"
    platform: x
    url: "https://x.com/yatharth170699/status/2116409257147150543"
    note: "Thread on how Claude Code's prompt caching works and what breaks the prefix"
  - handle: "anthropic"
    platform: web
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
    note: "Anthropic docs: prompt caching, cache breakpoints, and prefix matching"
---

## The problem

Providers bill a cached prompt read at a fraction of the normal input price (Anthropic's 5-minute cache is about **0.1×**). That only helps if the next request starts with the **exact same bytes**. Put a timestamp, a request id, or a freshly assembled tool list at the top of the system prompt and the cache misses from the first character. Every call then pays full input price for tools, rules and history that barely changed.

## The tip

Treat the prompt like a content-addressed blob:

1. **Static first.** Tools, system instructions, long reference docs — anything that stays the same across turns — go at the top.
2. **Dynamic last.** Timestamps, user ids, retrieved docs, the latest message — append them after a cache breakpoint.
3. **Don't poke the prefix mid-session.** Switching models, connecting or disconnecting an MCP server, or rewriting the system prompt mid-flight invalidates everything after the change. Compaction does too; treat it as a deliberate cache reset.

@amitsinha__07's one-liner: "a timestamp at the top of your system prompt quietly kills prompt caching." Put static instructions and tools first, dynamic data last.

## Example

```python
# Bad: dynamic content at the top → cache miss every call
system = f"Session started at {now.isoformat()}\n" + RULES + TOOLS

# Good: stable prefix first, dynamic fields last
system = RULES + TOOLS  # byte-stable across turns
user = f"User timezone: {tz}\nRequest id: {rid}\n\n{user_msg}"
# Mark a cache breakpoint at the end of the static block (SDK-specific).
```

(Exact `cache_control` shape depends on the SDK; the ordering rule does not.)

## When NOT to use it

Don't freeze a prefix that must change for safety — for example, when you intentionally rotate a system rule after a jailbreak attempt, or when you compact a 400K context down. Those are real invalidations. Also, very short prompts often sit under the provider's minimum cacheable size, so the tip doesn't buy you anything until the static block is large enough.
