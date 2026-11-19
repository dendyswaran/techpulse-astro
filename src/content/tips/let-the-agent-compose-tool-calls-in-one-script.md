---
title: "When a task chains several tool calls, let the agent write one script instead of making each call itself"
description: "Every direct tool call is a round trip through the model, and each intermediate result gets pasted into context. For multi-step tool workflows, give the agent a sandboxed code runner and have it compose the calls in one script that returns only the final answer."
pubDate: 2026-11-19T10:00:00+07:00
tags: ["mcp", "tooling", "token-cost", "agents", "context-engineering"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "aiDotEngineer"
    platform: x
    url: "https://x.com/aiDotEngineer/status/2122434537796010126"
    note: "AI Engineer Code Summit clip: @mitsuhiko (Earendil) argues for giving agents JavaScript to run so they can compose tool calls into a workflow"
  - handle: "Anthropic Engineering"
    platform: web
    url: "https://www.anthropic.com/engineering/code-execution-with-mcp"
    note: "Code execution with MCP: intermediate tool results passing through the model add tokens; code keeps them out of context"
---

## The problem

Classic tool calling is one call per model turn. Say the agent needs to list failing CI jobs, fetch each job's log, grep for the first error and group by test file. That's a dozen round trips, and **every intermediate payload gets pasted into the context**, then read again on every later turn. Anthropic's MCP engineering post has an example where a meeting transcript flows through the model twice just to move it from one tool to another. The model ends up acting as a slow, expensive pipe between tools.

## The tip

As a clip from AI Engineer Code Summit shared by @aiDotEngineer puts it, @mitsuhiko argues for "giving agents JavaScript to run, so they can compose tool calls into a workflow."

In practice:

1. Expose your tools as **functions inside a sandboxed runtime** (JS or Python), not only as separate tool calls.
2. When a task needs **three or more dependent calls**, or loops over results, tell the agent to write **one script** that does the calls, filtering and joining, and **returns only a compact result**.
3. Keep direct tool calls for single lookups and anything that needs a human decision between steps.

The large intermediate data stays in the sandbox's variables. The model only sees what the script prints.

## Example

Add this to `AGENTS.md` / `CLAUDE.md`:

```markdown
## Composing tools
- If a task needs 3+ dependent tool calls or a loop over results, write ONE
  script in the sandbox (tools are importable from `./tools`) instead of
  calling tools one by one.
- The script must print a summary under 40 lines: counts, IDs, first error
  per item. Never print raw logs or full API responses.
- Use direct tool calls only for single lookups or when you need my input
  between steps.
```

## When NOT to use it

Skip it when you have no real sandbox (resource limits, no secrets in scope, restricted network). Running model-written code against production credentials is a bigger risk than the tokens you save. Also skip it for one-off single calls, where writing a script costs more than it saves.
