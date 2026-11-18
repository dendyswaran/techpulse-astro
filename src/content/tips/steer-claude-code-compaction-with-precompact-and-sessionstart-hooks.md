---
title: "Steer what survives compaction: a PreCompact hook to guide the summary, a SessionStart hook to restore your notes"
description: "Long Claude Code sessions get compacted automatically, and sometimes while you're away. Two hooks control what the summary keeps and what gets reloaded afterwards, so the agent doesn't come back having forgotten the plan."
pubDate: 2026-11-18T10:00:00+07:00
tags: ["context-engineering", "claude-code", "hooks", "compaction", "agents"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "krika2810"
    platform: x
    url: "https://x.com/krika2810/status/2121808145018474811"
    note: "Pairs idle compaction with PreCompact (guide the summary) and SessionStart compact (reload saved notes) hooks"
  - handle: "Claude Code docs"
    platform: web
    url: "https://code.claude.com/docs/en/hooks"
    note: "PreCompact stdout becomes instructions for the compaction summary; SessionStart matcher 'compact' fires after compaction"
---

## The problem

Compaction swaps your conversation for a summary. That frees context, but the summarizer decides what to keep. Architectural decisions, the half-finished checklist and the bug you ruled out an hour ago can be reduced to one line or dropped. Claude Code can now also compact **while you're away**. With the 1-hour prompt cache, a long session left idle gets summarized before the cache expires. The `idleCompaction` setting turns that off. So you can come back to an agent that has quietly lost the plan.

## The tip

As @krika2810 points out, two hook events give you control over this:

- **`PreCompact`**: anything your hook prints to stdout becomes **instructions for the compaction summary**. Use it to list what must survive.
- **`SessionStart` with matcher `compact`**: this fires right after compaction. Its stdout is added to the new context, so you can **reload a handoff file and recent commits** exactly as written.

One hook guides the summary and the other restores the facts word for word. You can use either one alone. Keep the handoff file short, because the reloaded text takes up context too.

## Example

`.claude/settings.json`:

```json
{
  "hooks": {
    "PreCompact": [
      { "hooks": [{ "type": "command",
        "command": "echo 'Keep verbatim: decisions + reasons, open TODOs with file paths, failed approaches, current test status.'" }] }
    ],
    "SessionStart": [
      { "matcher": "compact",
        "hooks": [{ "type": "command",
        "command": "cat .claude/HANDOFF.md 2>/dev/null; git log --oneline -8" }] }
    ]
  }
}
```

Ask the agent to update `.claude/HANDOFF.md` whenever it finishes a step, or do it from a `Stop` hook.

## When NOT to use it

Skip it for short sessions that never get near compaction, and for one-off tasks where `/clear` is the better reset. Don't dump big files from `SessionStart`: a 20K-token handoff undoes most of what compaction saved.
