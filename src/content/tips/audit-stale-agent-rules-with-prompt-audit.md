---
title: "Audit your agent rules files for instructions written for older models"
description: "CLAUDE.md files, skills and custom commands pile up rules meant for older models, plus dead paths and instructions that contradict each other. Claude Code's /doctor prompt-audit finds them and changes nothing until you approve."
pubDate: 2026-11-02T10:00:00+07:00
tags: ["claude-code", "CLAUDE.md", "context", "agents", "maintenance"]
difficulty: beginner
author:
  name: Mazzden
sources:
  - handle: "Bober_smart"
    platform: x
    url: "https://x.com/Bober_smart/status/2116170627631517814"
    note: "Step-by-step walkthrough of /doctor prompt-audit, including the path-scoped form"
  - handle: "karlarboledas"
    platform: x
    url: "https://x.com/karlarboledas/status/2116536943450194082"
    note: "Short summary of the same workflow"
  - handle: "Claude Code changelog"
    platform: web
    url: "https://raw.githubusercontent.com/anthropics/claude-code/v2.1.283/CHANGELOG.md"
    note: "v2.1.283 release notes that introduce /doctor prompt-audit"
---

## The problem

Instruction files tend to grow and rarely get pruned. A CLAUDE.md you wrote months ago may still shout "ALWAYS think step by step" or "NEVER skip the checklist", habits that were meant for older models. Over time it also points to scripts you've renamed and quietly disagrees with a skill or an AGENTS.md someone added later. The agent loads all of it on every session, and when two rules clash it has to guess which one wins.

## The tip

Treat your rules files like code and lint them. Claude Code v2.1.283 added `/doctor prompt-audit` (also available as `/checkup prompt-audit`). According to the changelog, it audits your CLAUDE.md files, skills, agents and commands for "prompting patterns written for older models". Stale paths, stale commands and contradicting instruction files are listed first in the report.

As @Bober_smart's walkthrough points out, it's a review, not a rewrite. You get a list of suggested fixes, and nothing changes until you tell Claude to apply them. You can also aim it at a single directory instead of the whole setup. While you're at it, keep each CLAUDE.md short. Both posts cite Anthropic's guidance of staying under about 200 lines per file.

## Example

```bash
claude update                 # needs v2.1.283 or newer
claude                        # start a session in the repo

> /doctor prompt-audit                         # whole setup
> /doctor prompt-audit .claude/ skills/deploy  # just one area

# Read the report, then approve fixes selectively:
> Apply fixes 1, 3 and 4. Leave the deploy checklist as is.
```

Run it after a model upgrade, and before you copy a rules file into a new repo.

## When NOT to use it

Skip it on a fresh, minimal CLAUDE.md, or when a "legacy-looking" rule is a deliberate guardrail (compliance steps, production deploy gates). Don't bulk-accept fixes that remove those.
