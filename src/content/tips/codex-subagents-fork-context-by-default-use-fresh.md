---
title: "Codex subagents inherit your whole context by default. Ask for a fresh one"
description: "In Codex's current multi-agent tool, a spawned subagent gets the parent's full history unless the model passes fork_turns \"none\". For reviewers and spec checkers that defeats the point of a subagent, so put \"fresh context window\" in your instructions."
pubDate: 2026-11-03T10:00:00+07:00
tags: ["codex", "subagents", "context", "orchestration", "token-cost"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "mattpocockuk"
    platform: x
    url: "https://x.com/mattpocockuk/status/2115751897558614073"
    note: "Flagged that Codex was forking the parent context into most subagents, and shipped a skills fix"
  - handle: "csehra42"
    platform: x
    url: "https://x.com/csehra42/status/2116410678319718481"
    note: "Source-code walkthrough of fork_turns and the V1 to V2 default flip"
  - handle: "openai/codex"
    platform: web
    url: "https://github.com/openai/codex/blob/main/codex-rs/core/src/tools/handlers/multi_agents_v2/spawn.rs"
    note: "spawn_agent handler: an empty or missing fork_turns falls back to \"all\""
  - handle: "mattpocock/skills PR #1341"
    platform: web
    url: "https://github.com/mattpocock/skills/pull/1341"
    note: "\"Start subagents with a fresh context window, not a fork\""
---

## The problem

You spin up a subagent for code review because you want a reviewer that hasn't watched you talk yourself into the bug. In Codex, that's often not what you get. As @mattpocockuk pointed out, Codex was "biasing most of its subagents to inherit its context window from the parent agent". In other words, it forks.

The source confirms it. In `multi_agents_v2/spawn.rs`, `spawn_agent` takes an optional `fork_turns` argument. If it's missing or empty, the handler uses `"all"`, which means full parent history. Legacy numeric values also give you full history. Only `"none"` starts the child with just its prompt. The older V1 tool used `fork_context` and defaulted to a fresh context. V2 flipped that default.

The cost is easy to work out. Five forked children off a 100K-token parent carry 500K tokens of inherited context before they do any work. A forked reviewer also inherits your assumptions.

## The tip

The model fills in `fork_turns`, not you, so the request has to be in the instructions. Say "fresh context window" wherever a skill or prompt dispatches a subagent, and keep a repo-level rule so new skills follow it. That's what Matt's PR did across 8 skills. Give the child a self-contained brief so it doesn't need the parent's history.

## Example

```markdown
<!-- AGENTS.md -->
## Subagents
- Review, spec-check and research subagents: always spawn with a
  fresh context window (fork_turns: "none"). Never fork.
- Give each one a self-contained brief: goal, files to read,
  acceptance criteria, output format.
- Fork (fork_turns: "all") only for continuation work, such as
  finishing a half-done refactor.
```

```text
Spawn a subagent with a fresh context window to review the diff in
`git diff main...HEAD` against docs/spec.md. Report only concrete
defects with file:line. Do not fix anything.
```

## When NOT to use it

Don't force fresh contexts for continuation tasks where writing the brief would lose more than handing over the history. Skip the rule on harnesses that already start subagents fresh by default, such as Claude Code.
