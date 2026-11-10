---
title: "Claude Fable 5.2 and Mythos 5.2: Anthropic's Frontier Tier Gets 20% Cheaper and Learns to Run Agent Teams"
subtitle: "Same 1M-token context, $8/$40 per million tokens instead of $10/$50, and a pitch aimed at orchestrators and advisors. The API also gets stricter about how you replay thinking blocks."
pubDate: 2026-11-10
category: "ai"
tags: ["Anthropic", "Claude Fable 5.2", "Claude Mythos 5.2", "Frontier Models", "Agentic Coding", "Pricing", "Claude Code"]
readingTime: "6 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: true
coverImage: "/images/covers/claude-fable-5-2-mythos-5-2-cheaper-frontier-orchestrator.webp"
coverAlt: "Soft gouache illustration of a tall terracotta tower on a sage-green plain, with thin ink threads running from its top to a row of small grey arches on either side, under a muted ochre sun"
coverCaption: "Illustration by TechPulse Editorial · One tall tower, many small rooms it sends work to."
tldr:
  - "Anthropic released Claude Fable 5.2 (claude-fable-5-2) and Claude Mythos 5.2 on November 9, 2026. They are the same underlying model; Fable ships with cyber and biology safeguards, Mythos goes only to vetted organizations."
  - "Pricing drops from $10/$50 to $8/$40 per million input/output tokens. Both have a 1M-token context and 128K max output. Fast mode (up to 2.5x output speed) costs $16/$80."
  - "On FrontierCode 2.0, Fable 5.2 at High effort scores about level with Opus 5.5 at Max (45.3% vs 45.5%) for roughly half the cost per task; at Xhigh it reaches 49.1%. Anthropic still tells most users to start on Opus 5.5."
  - "Migration gotchas: the API defaults Fable 5.2 to high effort while Claude Code and the apps use medium, every account now gets a 400 error if you edit the prompt prefix and replay later thinking blocks, and computer use needs the new computer_toolset_20260801."
sources:
  - label: "Anthropic — Introducing Claude Fable 5.2 and Claude Mythos 5.2"
    url: "https://www.anthropic.com/claude-fable-and-mythos-5-2"
  - label: "Claude Platform docs — Claude Fable 5.2 overview"
    url: "https://platform.claude.com/docs/en/models/fable-5-2/overview"
  - label: "Claude Platform release notes — November 9, 2026"
    url: "https://platform.claude.com/docs/en/release-notes/overview"
  - label: "Claude Platform docs — Optimizing for cost and intelligence"
    url: "https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence"
  - label: "The Verge — Anthropic launches new Claude Fable and Mythos 5.2 models"
    url: "https://www.theverge.com/ai-artificial-intelligence/1030005/anthropic-claude-fable-mythos-5-2"
---

Anthropic shipped **Claude Fable 5.2** and **Claude Mythos 5.2** on **November 9, 2026**, two months after the 5.1 pair. As before, they are one model with two front doors: **Fable** carries classifiers that block high-risk cybersecurity and most research-biology tasks, so it is open to everyone; **Mythos** has those safeguards relaxed and is limited to organizations in Anthropic's Cyber and Life Sciences Verification Programs.

## What changed for developers

| | Fable 5.2 / Mythos 5.2 | Fable 5.1 / Mythos 5.1 |
| --- | --- | --- |
| Input / output price | **$8 / $40** per MTok | $10 / $50 per MTok |
| Fast mode | $16 / $80, up to 2.5x output speed | — |
| Context / max output | 1M / 128K | 1M / 128K |
| Thinking | Adaptive, always on | Adaptive |
| API model ID | `claude-fable-5-2` / `claude-mythos-5-2` | `claude-fable-5-1` |

Anthropic says outputs come back **up to 30% faster** than 5.1. Cache reads on Fable 5.2 are billed at **2.5%** of the input price, so long agent loops that keep their prefix stable get very cheap per turn. The model is live on the Claude API, Claude Code, Amazon Bedrock, Google Cloud and Microsoft Foundry.

## Benchmarks, read carefully

Anthropic's own table puts Fable 5.2 ahead of Opus 5.5, GPT-6 Astra and Gemini 4 Carbon on most rows:

- **FrontierCode 2.0** (would maintainers merge the change?): 49.1% at Xhigh, vs 45.5% for Opus 5.5 and 42.8% for GPT-6 Astra.
- **FrontierSWE v2:** 69.9%, vs 62.3% for Opus 5.5.
- **OSWorld 2.1** (computer use): 89.3%.
- **CVE Rediscovery** (Mythos 5.2): 89.6%, finding 14.4% more vulnerabilities than Mythos 5.1.

The more useful number is cost. At **High** effort, Fable 5.2 scores 45.3% on FrontierCode, level with Opus 5.5's best, for **roughly half the cost per task**. Anthropic's cost guide is just as blunt the other way, though. On its SWE-bench Pro subset, Opus 5.5 at `xhigh` matches Fable 5.2 at `high` for a little over half the cost. On a research benchmark, Fable 5.2 cost 2.9x as much as Opus 5.5 and scored 1.9 points lower. Anthropic's advice is still: **start on Opus 5.5** and move up only when your own evals fall short.

## Built to coordinate

The launch post leans on agent teams. Anthropic says a team of 1,000 Fable 5.2 agents formalized Fermat's Last Theorem in Lean in 30 hours. In another experiment, Fable 5.2 coordinated more than 1,000 subagents over eight days to build a prototype operating system that boots on a laptop. Anthropic now pitches the model in two roles: **Advisor**, which Haiku, Sonnet or Opus executors consult on hard calls, and **Orchestrator**, which hands simpler work to smaller models.

Anthropic's cost guide adds a caveat. In its measurements, an advisor only helps when the executor actually consults it. Orchestration paid off only for routine work with a long cost tail, or for work bigger than one context window.

## Migration gotchas

The release notes include a few breaking changes:

1. **Effort defaults differ.** `high` is the default on the Messages API, but Claude Code and the Claude apps run Fable 5.2 at `medium`. The headline "Opus-level for half the cost" result is at High.
2. **The prefix check is now universal.** If your harness edits the `system` prompt, `tools`, or an earlier message and then sends back a Fable 5.2 thinking block from a later turn, the request returns **400**, whatever your account's age.
3. **Thinking blocks are account-bound** and are dropped when a conversation moves from Fable 5.2 to another model.
4. **Computer use** needs `computer_toolset_20260801`. The older `computer_20251124` tool returns 400 everywhere except Bedrock.
5. **Advisor tool:** a Fable 5.2 or Mythos 5.2 executor accepts only Fable 5.2 or Mythos 5.2 as its advisor.
6. **Data retention:** both models require 30-day retention and are not available under zero data retention unless Anthropic expressly approves it.

## Safety notes

Anthropic says Fable 5.2's safeguards trigger about **55% fewer** unnecessary blocks than 5.1's. When a request is blocked, it falls back to Opus 4.8 for cybersecurity and Opus 5 for biology. In an adversarial sandbox-escape evaluation with a deliberately weak sandbox, Mythos 5.2 used credentials planted outside the sandbox in **3.1%** of scenarios, down from 21% for Mythos 5.1. Anthropic also says it deliberately held back gains in kernel optimization and LLM architecture research, keeping those at roughly Opus 5.5 level.

## What to do

- Keep your daily coding loop on Opus 5.5 at medium. Benchmark Fable 5.2 at `low` and `high` on your hardest tenth of tasks and compare **cost per finished task**.
- Before switching, grep your harness for code that rewrites earlier messages or the system prompt. That pattern is now a hard 400 error.
- If you run long unattended jobs, test Fable 5.2 as the orchestrator with Sonnet 5.5 subagents. Measure it against Fable alone at lower effort before you commit.
