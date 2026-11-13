---
title: "Append changes to an agent conversation instead of editing what's already there"
description: "On Claude models with preserved thinking, changing the system prompt, the tool list or an earlier message can invalidate the model's earlier reasoning, and the request can fail with a 400. Keep the history fixed and put updates at the end."
pubDate: 2026-11-13T10:00:00+07:00
tags: ["context-engineering", "agents", "claude", "preserved-thinking", "harness"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "ClaudeDevs"
    platform: x
    url: "https://x.com/ClaudeDevs/status/2119868703265419688"
    note: "Preserved thinking now covers all API accounts on Fable 5.2; editing prior context can 400"
  - handle: "anthropic"
    platform: web
    url: "https://platform.claude.com/docs/en/build-with-claude/preserved-thinking/change-tools-or-instructions"
    note: "Anthropic docs: change tools or instructions without failing the prefix check"
---

## The problem

Many home-made agent loops rebuild the request on every turn. They put the current date in the system prompt, add or remove tools as MCP servers connect, rephrase an old instruction, or trim a noisy tool result. Before, the cost of that was a prompt-cache miss. On models with **preserved thinking** (Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5 and others), the cost is higher: each earlier thinking block is tied to everything that came before it. Change anything ahead of it and the block fails a prefix check, so you either lose that reasoning or get an error. As @ClaudeDevs put it: "Editing prior context can 400."

## The tip

Treat the conversation as append-only:

1. Send `system` and `tools` **exactly the same** on every request.
2. Send assistant turns back **exactly as returned**, including thinking blocks with empty text.
3. To change instructions, **add a `role: "system"` message after the newest user message**. Don't rewrite the top of the prompt.
4. For a new date, branch or file state, **add a text block to the next user message**, only when the value changes.
5. To add or remove tools, append a `tool_addition` / `tool_removal` system block. To turn tools off for one request, use `tool_choice: {"type": "none"}` and leave `tools` alone.
6. When you switch models, **keep one shared history**. The API skips blocks the new model can't read, without an error.

## Example

```json
{
  "system": "<unchanged since turn 1>",
  "tools": ["<unchanged since turn 1>"],
  "messages": [
    "...earlier turns, byte-for-byte as returned...",
    { "role": "user", "content": [
      { "type": "text", "text": "Environment update: branch is now release-2." },
      { "type": "text", "text": "Run the tests again." }
    ]},
    { "role": "system", "content": "From now on, do not edit files under /migrations." }
  ]
}
```

Claude Code, Managed Agents and the Agent SDK already work this way. The rule matters most for your own harness, gateway or proxy.

## When NOT to use it

If you have to remove secrets or injected text from the history, rewriting is the right call. Remove every thinking block after the first place that text appears, and accept that the model loses that reasoning.
