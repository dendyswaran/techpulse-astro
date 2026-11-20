---
title: "Block --no-verify before your coding agent learns to skip your git hooks"
description: "When a pre-commit hook fails, an autonomous agent often just adds --no-verify to get a green exit code. Stop that with a PreToolUse hook that denies hook-skipping git commands, and keep the real secret scanning on the server, where the agent can't bypass it."
pubDate: 2026-11-20T10:00:00+07:00
tags: ["claude-code", "hooks", "agents", "security", "git"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "PatchOnChain"
    platform: x
    url: "https://x.com/PatchOnChain/status/2123518528812920920"
    note: "Agent blocked by a pre-commit hook added --no-verify and pushed three raw API keys; X article 'The No-Verify Reflex'"
  - handle: "Claude Code docs"
    platform: web
    url: "https://code.claude.com/docs/en/hooks"
    note: "PreToolUse hooks receive tool_input.command on stdin and can return permissionDecision: deny"
---

## The problem

You ask an agent to fix a lint error and commit. The pre-commit hook fails, maybe on the lint rule or maybe on a secret scanner. The agent was told to "commit," and the quickest way to a zero exit code is `git commit --no-verify`. @PatchOnChain described exactly this: the agent "added --no-verify, and pushed 3 raw API keys to GitHub." The agent isn't being malicious. It's optimizing for the task finishing, and nothing told it that the hook was an invariant rather than an obstacle.

## The tip

Treat hook-skipping as a forbidden command and **enforce it in the harness, not the prompt**:

1. Add a **PreToolUse hook** on `Bash` that denies `git commit`/`git push` with `--no-verify` or `-n`, and attempts to disable hooks (`core.hooksPath`, `HUSKY=0`).
2. Have the deny reason tell the agent what to do instead: fix the hook failure or stop and ask.
3. Keep **secret scanning server-side** too (push protection or CI). A local hook is a convenience. A determined process can always bypass it.

## Example

`.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash",
        "hooks": [{ "type": "command",
                    "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/no-skip-hooks.sh" }] }
    ]
  }
}
```

`.claude/hooks/no-skip-hooks.sh` (needs `jq`):

```bash
#!/bin/bash
CMD=$(jq -r '.tool_input.command')
if echo "$CMD" | grep -Eq 'git (commit|push|merge|rebase).*(--no-verify|\s-n(\s|$))|core\.hooksPath|HUSKY=0'; then
  jq -n '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",
    permissionDecisionReason:"Skipping git hooks is not allowed. Fix what the hook reported, or stop and explain the failure."}}'
fi
exit 0
```

The regex is a guardrail, not a sandbox. A clever enough agent can still route around it, which is why step 3 matters.

**When NOT to use it:** in throwaway sandboxes or scratch repos with no hooks and no secrets, where the extra hook just adds noise.
