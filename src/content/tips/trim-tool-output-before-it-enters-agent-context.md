---
title: "Trim tool output before it enters the context: in long agent runs, cache reads are most of the bill"
description: "A Berkeley study of Claude Code and Codex traces found that re-reading cached context makes up as much as 73% of a long run's cost, and agents only use 27% of the tool-output tokens they keep. Make tool output smaller when it arrives, not afterwards."
pubDate: 2026-11-16T10:00:00+07:00
tags: ["context-engineering", "token-cost", "agents", "prompt-caching", "harness"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "ContextWindow_"
    platform: x
    url: "https://x.com/ContextWindow_/status/2121241898367262751"
    note: "Summary of the Berkeley paper: cache reads 53–73% of cost, only 27% of tool-output tokens used"
  - handle: "arxiv"
    platform: web
    url: "https://arxiv.org/abs/2611.12122"
    note: "Park, Stoica, Cheung et al. — System Optimizations for Cost-Efficient Agent Harnesses"
---

## The problem

Prompt caching makes re-reading context cheap per token, but you still pay for it on every call. Each tool call is another model call, and it bills the whole cached prefix again. @ContextWindow_ summarized a new Berkeley paper (Park, Stoica, Cheung et al.) on this. As context grows, cache reads go from 13–30% of total cost to **53–73%**. In the paper's example, a single `grep` at 100K tokens of context costs about as much as 10K new input tokens. On top of that, agents later use only **27%** of the tool-output tokens they keep, and **36%** of tool outputs are never used at all. Whole-file reads are the biggest offender.

## The tip

Make tool output small **when it arrives, before it enters the context**. Editing old context breaks the cache for everything after the edit. Trimming at the point of entry costs nothing, and every later turn benefits.

1. Read line ranges or `grep -n` matches, not whole files.
2. Remove noise from command output: progress bars, blank lines, repeated log lines, passing tests.
3. If you run the same command again in an edit/test loop, return only what changed.
4. Ask for independent reads in one turn. The paper's own data is mixed here: when batching was tested alone on coding tasks, the model added unnecessary calls and cost went up by 2%. Don't force it.

## Example

Add this to `AGENTS.md` / `CLAUDE.md`:

```markdown
## Tool output budget
- Never cat whole files over 200 lines. Use `rg -n "<symbol>" path` first,
  then read only the needed range (e.g. `sed -n '120,180p' file`).
- Pipe noisy commands: `npm test 2>&1 | grep -E "FAIL|Error|✕" | head -50`.
- Build logs: show the last 40 lines and any line matching "error".
- Make independent reads in the same turn; don't add calls you don't need.
```

The paper combined harness-side compaction, garbage collection of stale context, and metadata for file search. Together they cut cost to **0.77×** of the baseline while keeping accuracy at 0.97×. Tool-output compaction alone saved about 3% on coding tasks, so think of it as a habit that adds up over a long run, not a big win on any single step.

## When NOT to use it

For short sessions, or when you're debugging something you don't yet understand, read the whole file or log. If trimming hides the one line that matters, the extra turns it takes to find it cost more than the tokens you saved.
