---
title: "Compact earlier: lower Claude Code's auto-compact window for long-running goals"
description: "On 1M-context models Claude Code lets a session fill almost the whole window before it compacts. For multi-hour goals, a smaller auto-compact window keeps the working context shorter and every turn cheaper."
pubDate: 2026-11-25T10:00:00+07:00
tags: ["context-engineering", "claude-code", "compaction", "token-cost", "agents"]
difficulty: beginner
author:
  name: Mazzden
sources:
  - handle: "nateherk"
    platform: x
    url: "https://x.com/nateherk/status/2124541215333044480"
    note: "Moved auto-compact from the ~967K default to 400K for long goals; set via /autocompact or autoCompactWindow"
  - handle: "Claude Code docs"
    platform: web
    url: "https://code.claude.com/docs/en/model-config#set-the-auto-compact-window"
    note: "/autocompact, --autocompact, autoCompactWindow (100,000 or more), CLAUDE_CODE_AUTO_COMPACT_WINDOW, per-subagent frontmatter"
---

## The problem

A 1M-token context window is handy, but filling it isn't free. Claude Code's docs say sessions on Haiku 5.5 auto-compact at **about 967K tokens** by default. Until that point, every turn re-sends a nearly full window. That's slow, it eats into usage limits, and recall tends to get worse as the context grows (often called context rot).

## The tip

@nateherk lowered his auto-compact window to **400K** for long goals. In his words, he's "been letting goals run for hours like this and getting noticeably better results." The tradeoff is more compactions, in exchange for a shorter working context on every turn.

There are several ways to set it, all documented:

- `/autocompact 400k` saves the window for the current model and applies it right away. `/autocompact auto` restores the default.
- `claude --autocompact 400k` sets it for one launch only.
- `"autoCompactWindow": 400000` in `settings.json` applies to every model. The minimum is 100,000.
- `CLAUDE_CODE_AUTO_COMPACT_WINDOW=400000` for CI and scripts. It overrides the other settings.
- `autoCompactWindow` in a subagent's frontmatter gives one subagent its own window.

## Example

`~/.claude/settings.json`, plus a log-reading subagent that compacts even earlier:

```json
{ "autoCompactWindow": 400000 }
```

```yaml
---
name: log-reader
description: Reads long CI logs and reports only the failures
autoCompactWindow: 200000
---
```

More compactions means the summary matters more. Pair this with a PreCompact hook that tells the summarizer what to keep (see our earlier tip on steering compaction).

## When NOT to use it

Skip it when the task needs a huge amount of material in view at once, like a cross-file refactor that has to see a 600K-token codebase. Skip it for short sessions that never get near the limit. And skip it behind a gateway that already caps you lower: set the window to that cap instead.
