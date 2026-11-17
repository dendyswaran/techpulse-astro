---
title: "Pin a model on every Claude Code subagent: a blank model field means it runs on your most expensive one"
description: "A subagent with no model field runs on whatever the main session uses, so grep and summary jobs end up on Opus or Fable. Set the model per agent, add a cheap fallback for agents you forgot, and check with /tasks."
pubDate: 2026-11-17T10:00:00+07:00
tags: ["subagents", "model-routing", "token-cost", "claude-code"]
difficulty: beginner
author:
  name: Mazzden
sources:
  - handle: "thedelost"
    platform: x
    url: "https://x.com/thedelost/status/2122091423180992925"
    note: "Thread on routing Claude Code subagents to Haiku, Sonnet or Fable via the model frontmatter field"
  - handle: "Claude Code docs"
    platform: web
    url: "https://code.claude.com/docs/en/sub-agents"
    note: "Official subagent model order: per-invocation parameter, model field, CLAUDE_CODE_SUBAGENT_MODEL, then the parent's model"
---

## The problem

You moved repo search, log reading and summaries into subagents to keep the main context clean. Then you select Opus or Fable for the main session, and the subagents run on it too. @thedelost's thread puts it bluntly: leave `model` out "and the subagent silently inherits your main model." The Claude Code docs say the same: by default, a subagent you define runs on the model of the conversation that starts it.

## The tip

Choose the model for each agent in `.claude/agents/` (or `~/.claude/agents/`), based on the job:

- Agents that only read (search, grep, docs lookup, summaries) get `haiku`.
- The agent that writes the diff gets `sonnet`.
- Use a frontier model only where judgment matters, such as a reviewer.

Then set `CLAUDE_CODE_SUBAGENT_MODEL` as a cheap fallback. Claude Code resolves a subagent's model in this order: the per-invocation `model` parameter, then the agent's `model` field, then the env var, then the parent's model. The env var therefore only applies to agents with no `model` field. It also doesn't change the built-in **Explore** and **Plan** agents on its own. To change Explore, define your own agent named `Explore` with `model: haiku`.

## Example

```markdown
<!-- .claude/agents/repo-search.md -->
---
name: repo-search
description: Finds files and symbols. Returns paths and line numbers only.
tools: Read, Grep, Glob
model: haiku
---
Search, don't edit. Reply with at most 20 `path:line` hits.
```

```jsonc
// .claude/settings.json
{ "env": { "CLAUDE_CODE_SUBAGENT_MODEL": "haiku" } }
```

Run `/tasks` to see which model each subagent is actually on.

## When NOT to use it

Don't give a cheap model a subagent whose output you act on without checking, like an architecture decision or a security review. A wrong answer there costs more than the tokens you saved.
