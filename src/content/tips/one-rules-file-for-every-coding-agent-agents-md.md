---
title: "One rules file for every coding agent: AGENTS.md plus a one-line import"
description: "Teams that mix Claude Code, Codex, Cursor and Copilot end up with drifting instruction files. Keep the rules in AGENTS.md and have CLAUDE.md import it."
pubDate: 2026-10-31T11:00:00+07:00
tags: ["context", "agents", "prompting"]
difficulty: beginner
author:
  name: Mazzden
sources:
  - handle: "oleh_meleshko"
    platform: x
    url: "https://x.com/oleh_meleshko/status/2076746341296828695"
    note: "Reduce CLAUDE.md to a single @AGENTS.md import"
  - handle: "8zero7"
    platform: x
    url: "https://x.com/8zero7/status/2111129007982805152"
    note: "Keep Claude-only notes below the import line"
  - handle: "Claude Code docs"
    platform: web
    url: "https://code.claude.com/docs/en/memory"
    note: "AGENTS.md loading rules and @path imports"
---

## The problem

Codex, Cursor and Copilot read `AGENTS.md`. Claude Code reads `CLAUDE.md`. Recent Claude Code versions can read `AGENTS.md` directly, but only when no `CLAUDE.md` exists. Once a repo has both, Claude reads only `CLAUDE.md` by default. Teams then copy rules between the two files, and within a month they disagree on the test command.

## The tip

Make `AGENTS.md` the single source of truth for build commands, conventions and project layout. Put an `@AGENTS.md` import on the first line of `CLAUDE.md`. Claude Code expands `@path` imports when it loads the file, so it sees the same rules every other agent sees. Anything that only applies to Claude (plan-mode rules, Claude-specific skills) goes below the import.

A symlink (`ln -s AGENTS.md CLAUDE.md`) also works, but the import is safer: Git on Windows often checks symlinks out as plain text files, and an import leaves room for Claude-only notes.

## Example

```markdown
<!-- CLAUDE.md -->
@AGENTS.md

## Claude Code only
- Use plan mode for any change under `src/billing/`.
- Run `/context` after editing this file to confirm both files loaded.
```

## When NOT to use it

If your team only uses Claude Code, skip the indirection and keep one `CLAUDE.md`. Imports also don't reduce context cost, so a bloated `AGENTS.md` is still bloated.
