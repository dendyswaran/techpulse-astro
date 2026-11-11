---
title: "Run Claude Code on Sonnet and keep Opus on call as an advisor"
description: "You don't need the expensive model on every turn. With Claude Code's advisor tool, a Sonnet main session does the work and consults Opus only before it commits to a plan, when an error keeps coming back, and before it says it's done."
pubDate: 2026-11-11T10:00:00+07:00
tags: ["model-routing", "claude-code", "advisor", "token-cost", "planner-executor"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "Voxyz_ai"
    platform: x
    url: "https://x.com/Voxyz_ai/status/2119082454120337491"
    note: "Claude Code tip: Sonnet 5.5 main session with Opus as advisor, plus a setup prompt"
  - handle: "anthropic"
    platform: web
    url: "https://code.claude.com/docs/en/advisor"
    note: "Claude Code docs: Escalate hard decisions with the advisor tool (pairings, cost, caching)"
---

## The problem

Most of a coding-agent session is routine: reading files, small edits, running tests. Running all of it on the strongest model burns quota or budget on turns that don't need it. Running everything on a cheaper model saves money until it confidently picks the wrong plan.

## The tip

Split the roles. @Voxyz_ai's post, with close to 1,000 bookmarks, shows the setup: put the **main session on Sonnet 5.5** and attach **Opus as an advisor**. Sonnet keeps writing the code. At decision points it calls Opus, which reads the full conversation, including tool calls and results, and returns guidance.

Per Anthropic's docs, Claude tends to consult the advisor **before committing to an approach, when an error keeps recurring, and before declaring a task done**. Advisor calls bill at the advisor's rates, but only happen at those moments. Toggling `/advisor` **doesn't invalidate the main prompt cache**, which switching models with `/model` does.

## Example

```bash
# one session
claude --model sonnet --advisor opus

# or make it the default in ~/.claude/settings.json
{
  "model": "sonnet",
  "advisorModel": "opus"
}
```

Then add one line to `CLAUDE.md` so the timing is explicit:

```markdown
Consult the advisor before committing to a large plan, when the same error appears twice, and before calling a long task done.
```

Things to check: the advisor must rank **at or above** the main model (Haiku 4.5 can't be an advisor). It needs the Anthropic API or Claude Platform on AWS, not Amazon Bedrock, Google Cloud's Agent Platform or Microsoft Foundry. Setting `CLAUDE_CODE_DISABLE_ADVISOR_TOOL=1`, or `DISABLE_TELEMETRY` (which blocks the feature-flag fetch), turns it off silently.

## When NOT to use it

Skip it for short tasks with little to plan, since the advisor adds tokens without much to decide. Skip it too when every turn needs deep reasoning; switch the main model instead.
