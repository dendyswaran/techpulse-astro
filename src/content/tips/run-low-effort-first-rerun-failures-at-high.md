---
title: "Run checkable tasks at low effort first, and re-run only the failures at high"
description: "If tests can tell you whether a task worked, a fixed high-effort setting is the expensive option. A low-effort first pass plus a high-effort retry on the failures solved slightly more tasks at a little over half the cost in Anthropic's measurements."
pubDate: 2026-11-10T10:00:00+07:00
tags: ["effort", "token-cost", "model-routing", "agents", "claude"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "camperaigg"
    platform: x
    url: "https://x.com/camperaigg/status/2119904535867252997"
    note: "TL;DR of Anthropic's model and effort playbook, including the low-then-high re-run policy"
  - handle: "anthropic"
    platform: web
    url: "https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence"
    note: "Anthropic docs: Re-run failures at higher effort, with the SWE-bench Pro subset figures"
---

## The problem

Most teams pick one effort level per model and leave it there. Set it to `high` "to be safe" and you pay for deep thinking on every task, including the easy majority that `low` would have solved on the first try.

## The tip

When an outcome is **checkable** (tests pass, a linter is clean, the row count matches), stop treating effort as a fixed setting. Make it a retry policy:

1. Run every task at `low`.
2. Check the result automatically.
3. Re-run **only the failures** at `high`.

@camperaigg's thread on Anthropic's new playbook flags this as one of the key tips, and Anthropic's cost guide backs it with numbers. On its SWE-bench Pro subset with Claude Opus 5.5, about 13% of tasks failed at `low`. Re-running those at `high` solved **about 97% for about $0.17 per task**, versus **95.3% at $0.29** with everything on `high`.

## Example

```python
def solve(task):
    result = run_agent(task, model="claude-opus-5-5", effort="low")
    if run_tests(task, result):          # your failure signal
        return result
    # fresh session, so the cache and effort change don't fight each other
    return run_agent(task, model="claude-opus-5-5", effort="high")
```

Start the retry as a **new session**. Changing top-level effort mid-conversation invalidates the prompt cache.

## When NOT to use it

Skip it when you have no reliable checker (a verifier that passes bad work lets failures through), or when latency matters more than cost, because every first-pass failure takes two runs' worth of wall-clock time.
