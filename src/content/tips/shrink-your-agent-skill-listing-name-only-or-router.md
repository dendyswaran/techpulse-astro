---
title: "Fifty installed skills is fifty descriptions in every prompt: shrink the skill listing"
description: "Agent skills load lazily, but their names and descriptions don't. Every installed skill sits in the system prompt on every turn and competes for the model's attention. Collapse rarely used skills to name-only, hide manual-only ones, or put the library behind a single router skill."
pubDate: 2026-11-23T10:00:00+07:00
tags: ["claude-code", "skills", "context-engineering", "token-cost", "agents"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "shantanugoel"
    platform: x
    url: "https://x.com/shantanugoel/status/2123863545335218492"
    note: "Dozens of installed skills pollute context in every session and make agents pick the wrong skill; built Skillmeister, a single router skill in front of a local skill library"
  - handle: "shantanugoel/skillmeister"
    platform: web
    url: "https://github.com/shantanugoel/skillmeister"
    note: "Local skill library router for AI coding agents; the agent sees only the router skill"
  - handle: "Claude Code docs"
    platform: web
    url: "https://code.claude.com/docs/en/skills"
    note: "Skill listing budget (1% of context), skillOverrides states, disable-model-invocation, /skill-doctor"
---

## The problem

Skills are sold as "free until used": the body of a `SKILL.md` only loads when the agent triggers it. The **listing** isn't free. Anthropic's docs put the always-loaded metadata at roughly **100 tokens per skill**, re-sent every turn. Install a few skill packs (video generation, slide decks, five flavours of debugging) and you're paying for dozens of descriptions in a coding session that will use two of them.

Tokens aren't the only cost. @shantanugoel put it this way: piling on skills "pollutes context in every session and makes agents pick the wrong skill." Overlapping descriptions turn skill selection into a guessing game. Claude Code also caps the listing at about **1% of the context window**, and when it overflows, it drops descriptions from your least-used skills first. That strips out the keywords the model matches against.

## The tip

Treat the skill listing like a menu, not a warehouse:

1. **Measure first.** Run `/skill-doctor` (or `/context`) to see what each skill costs and which have never been invoked.
2. **Collapse the long tail.** In `skillOverrides`, set rarely used skills to `"name-only"`, manual-only ones to `"user-invocable-only"`, and dead ones to `"off"`.
3. **Mark workflows you always trigger yourself** with `disable-model-invocation: true` so they stay out of the model's listing.
4. **Big library? Use one router.** Put the library behind a single skill that searches and loads on demand. That's the design of Skillmeister, which Goel built. Then **name the skill in your prompt** ("make a launch video using the hyperframes skill") so the lookup is exact.

## Example

`.claude/settings.json`:

```json
{
  "skillOverrides": {
    "remotion-video": "name-only",
    "pptx-builder": "name-only",
    "deploy": "user-invocable-only",
    "legacy-context": "off"
  }
}
```

A manual-only skill's frontmatter:

```yaml
---
name: release-notes
description: Draft release notes from merged PRs since the last tag.
disable-model-invocation: true
---
```

**When NOT to use it:** if you have fewer than about ten skills with distinct descriptions, the listing is cheap and auto-triggering works fine. A router or aggressive overrides just add a lookup step and make the agent less likely to reach for a skill on its own.
