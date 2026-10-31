---
title: "Push noisy side-work into subagents to keep the main context clean"
description: "Searching a codebase, reading logs and running test suites flood the context window with text you never look at again. Delegate them to a subagent that returns only a summary."
pubDate: 2026-10-31T10:00:00+07:00
tags: ["subagents", "context", "agents", "cost"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "svpino"
    platform: x
    url: "https://x.com/svpino/status/2055264566934978959"
    note: "Santiago on moving his Claude Code workflow to subagents"
  - handle: "Claude Code docs"
    platform: web
    url: "https://code.claude.com/docs/en/sub-agents"
    note: "Official subagent reference: own context window, tools and model per subagent"
---

## The problem

Long agent sessions degrade. Every file the agent greps, every 400-line test log and every documentation page it fetches stays in the context window. By the time it starts writing code, most of the context is noise from exploration, and the instructions you gave at the start compete with all of it.

## The tip

Treat the main session as the orchestrator and hand self-contained, high-output jobs to subagents. A subagent gets a fresh context window, does the messy reading, and sends back a short report. The verbose output never enters your main conversation.

Santiago (@svpino) put it bluntly: "Everything that can be a subagent should be a subagent." Two more benefits he points out are documented by Anthropic too: each subagent can run a different model, and each can get a narrower tool set, so a read-only reviewer cannot edit files.

Good candidates: codebase exploration, running the test suite and reporting only failures, summarizing logs, and independent research tracks that can run in parallel.

## Example

```markdown
<!-- .claude/agents/test-runner.md -->
---
name: test-runner
description: Runs the test suite and reports only failing tests. Use after code changes.
tools: Bash, Read, Grep
model: haiku
---

Run `npm test`. Report each failing test as: file, test name, one-line error.
If everything passes, reply with the pass count only. Never paste full logs.
```

Then in the main session: "Use the test-runner subagent and fix whatever it reports."

## When NOT to use it

Don't delegate quick, targeted edits or work that needs constant back-and-forth: a subagent starts without your conversation history, and its tokens still count toward your usage limits.
