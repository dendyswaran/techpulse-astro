---
title: "Don't start coding agents in Downloads: scan for stray AGENTS.md files first"
description: "Coding agents load instruction files from the folder you start them in and its parents. A dropped AGENTS.md or CLAUDE.md in Downloads or your home folder becomes the agent's orders."
pubDate: 2026-11-05T11:00:00+07:00
tags: ["security", "prompt-injection", "agents-md", "claude-code", "codex"]
difficulty: beginner
author:
  name: Mazzden
sources:
  - handle: "drensonai"
    platform: x
    url: "https://x.com/drensonai/status/2116946925500899371"
    note: "Found two instruction files in Downloads and Desktop; never start an agent inside ~/Downloads"
  - handle: "thecosmichaos"
    platform: x
    url: "https://x.com/thecosmichaos/status/2117295884564316465"
    note: "One-line find command to scan for AGENTS.md / CLAUDE.md files"
  - handle: "anthropic"
    platform: web
    url: "https://code.claude.com/docs/en/memory"
    note: "Claude Code docs: how CLAUDE.md files are discovered from the working directory upward"
---

## The problem

Claude Code, Codex and most other coding agents read project instruction files automatically: `CLAUDE.md`, `AGENTS.md` and similar. They look in the folder you launch from and walk up through its parents. That's what makes these files useful. It also means any file with that name in the right place gets treated as trusted instructions, not as data.

Browsers drop files into `~/Downloads` all the time, and unzipped archives spill into it too. If you `cd ~/Downloads` and start an agent to "look at this zip," a planted `AGENTS.md` sitting there can tell it to install a package, change a config or call a URL. It looks like an ordinary dev note, so you won't notice.

## The tip

Two habits close most of this off:

1. **Only start agents inside a real project folder.** Never in `~/Downloads`, `~/Desktop` or your bare home directory. Copy a file into a scratch repo first if you want the agent to inspect it.
2. **Scan for instruction files you didn't write.** @thecosmichaos shared a quick `find` for this. Anything you don't recognize, read it before you delete it.

Also check your agent's global config, such as `~/.codex/config.toml` or Claude Code settings, for MCP servers or base-URL overrides you didn't add.

## Example

```bash
# List agent instruction files near your home folder (skip node_modules)
find ~ -maxdepth 3 \( -name AGENTS.md -o -name CLAUDE.md \) \
  -not -path '*/node_modules/*' 2>/dev/null

# Safer way to have an agent inspect a downloaded archive
mkdir -p ~/scratch/inspect && cd ~/scratch/inspect && git init -q
unzip ~/Downloads/thing.zip -d ./thing
find ./thing \( -name AGENTS.md -o -name CLAUDE.md \)   # check before launching
claude   # or: codex
```

Pair it with your agent's approval prompts for package installs and network commands, so a bad instruction still has to get past you.

## When NOT to use it

Don't delete `AGENTS.md` or `CLAUDE.md` files inside repos you own or cloned on purpose. Those are the team's real rules. The scan is for files in places no project should live, and for files in cloned repos you haven't read yet.
