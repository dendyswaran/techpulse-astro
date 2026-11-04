---
title: "Don't preload every MCP schema into the agent session"
description: "A hundred MCP tools can cost 50–70K tokens of schema before the first prompt, and that tax is re-sent every turn. Expose tools through a CLI or tool-search so the model loads only what it needs."
pubDate: 2026-11-04T10:00:00+07:00
tags: ["mcp", "token-cost", "agents", "tooling", "prompt-caching"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "undefinedKi"
    platform: x
    url: "https://x.com/undefinedKi/status/2116247505193050474"
    note: "Summarizes Uber's agent cost levers, including the 50–70K token MCP schema tax and CLI/tool-search fix"
  - handle: "uber"
    platform: web
    url: "https://www.uber.com/us/en/blog/efficient-software-factory/"
    note: "Uber Engineering: Running a Software Factory Efficiently at Uber Scale (Aug 27, 2026)"
---

## The problem

MCP is convenient: connect a server, get a pile of tools. The cost shows up before you type anything. Uber's Software Factory post measured that loading 100+ MCP tools put roughly **50–70K tokens of schema** into the initial prompt. That payload is then re-sent on every turn, so it burns input tokens even when the agent never calls most of those tools. At Uber scale, that kind of fixed overhead is what kept the bill rising while usage grew 7×.

## The tip

Stop treating "installed" as "always in context." Give the agent a way to **resolve tools on demand**:

1. **CLI projection.** Expose the MCP gateway as shell commands. The model runs `my-tools search …` or `my-tools call …` instead of carrying every JSON schema in the system prompt.
2. **Tool search.** Keep a catalog the model can query, then load only the schemas it picks for this turn.
3. **Code-mode for chatty flows.** When a workflow needs poll-wait-poll (SQL jobs, ticket sync), have the agent write one script that loops outside the model. Uber measured 55–71% fewer tokens even on tiny queries this way.

As @undefinedKi put it when summarizing Uber's setup: "Don't load every MCP tool. With 100+ tools installed, the schemas alone cost 50K to 70K tokens before the first prompt."

## Example

```bash
# Instead of wiring 40 MCP tools into every session:
# claude mcp add --transport http jira https://mcp.example/jira
# claude mcp add --transport http sentry https://mcp.example/sentry
# ... ×40

# Project the gateway once as a CLI the agent can call:
cat > ~/bin/mcpx <<'SH'
#!/usr/bin/env bash
# usage: mcpx search <query> | mcpx call <tool> --json '{...}'
exec curl -sS "$MCP_GATEWAY/cli" -d "{\"op\":\"$1\",\"arg\":\"$2\",\"body\":$3}"
SH
chmod +x ~/bin/mcpx
```

Then tell the agent: *Use `mcpx search` to find a tool, then `mcpx call`. Do not assume every SaaS tool is already loaded.*

## When NOT to use it

Skip this if you only have a handful of MCP servers and the schemas are tiny (a few thousand tokens total). The indirection costs more than it saves. Also skip it for tools the agent needs on **every** turn — keep those few schemas hot in the prefix so prompt caching can amortize them.
