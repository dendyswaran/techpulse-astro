---
title: "Your prompt cache dies after 5 idle minutes: use the 1-hour TTL for slow agent loops"
description: "Anthropic's default prompt cache lasts 5 minutes from the last request. Pauses for reviews, CI runs or long subagent work quietly turn cheap cache reads into full-price re-reads."
pubDate: 2026-11-09T11:00:00+07:00
tags: ["prompt-caching", "token-cost", "claude", "agents", "context-engineering"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "Synrouterdotai"
    platform: x
    url: "https://x.com/Synrouterdotai/status/2119466104531894501"
    note: "Points out that the default Anthropic cache expires after 5 minutes, so coffee breaks and CI runs lose it"
  - handle: "anthropic"
    platform: web
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
    note: "Claude docs: 5-minute default lifetime, 1-hour TTL at 2x base input for writes, cache reads at 0.1x or lower"
---

## The problem

Prompt caching is what makes long agent sessions affordable. Cache reads cost 10% of the base input price on most Claude models, and even less on the newest ones. But the default cache only lives **5 minutes**, and the timer starts when a request *begins*, not when it ends. As @Synrouterdotai put it, "the default cache expires in 5 minutes."

So any gap longer than that throws the cache away: you read a diff, a CI run, a slow subagent, a human approval. The next turn re-writes the whole prefix at **1.25x** the input price instead of reading it at 0.1x. On a 150K-token agent context, that's the difference between a cheap turn and one of your most expensive.

## The tip

If your loop regularly pauses for **more than 5 minutes but less than an hour**, mark the stable prefix (tools, system prompt, big docs) with `"ttl": "1h"`. A 1-hour cache write costs **2x** base input instead of 1.25x. It pays for itself the first time it saves a re-write after a pause.

Keep the default 5-minute TTL for anything you hit more often than every 5 minutes. Each read refreshes it for free. If you mix TTLs, the 1-hour breakpoints must come **before** the 5-minute ones.

## Example

```json
{
  "model": "claude-opus-5-5",
  "max_tokens": 4096,
  "system": [
    {
      "type": "text",
      "text": "<agent rules + repo map + tool docs, ~40K tokens>",
      "cache_control": { "type": "ephemeral", "ttl": "1h" }
    }
  ],
  "messages": [ ... ],
  "cache_control": { "type": "ephemeral" }
}
```

The top-level `cache_control` keeps auto-caching the growing conversation at 5 minutes. The big static prefix survives an hour of idle time. Check `usage.cache_creation.ephemeral_1h_input_tokens` and `cache_read_input_tokens` to confirm it's working.

## When NOT to use it

Skip it for tight loops that fire every few seconds (the 5-minute cache already stays warm), for one-shot requests, and for prefixes that change every turn. Paying 2x to write a cache nobody reads again only costs you more.
