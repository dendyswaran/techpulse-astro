---
title: "GPT-6.2 Astra and Sol: OpenAI Cuts Astra to $8 / $40, Keeps Sol at $2 / $10, and Changes How Reasoning Survives Prompt Edits"
subtitle: "OpenAI's new pair targets long professional and agentic work with fewer output tokens per task. Both have a 1.05M-token window. For developers, the bigger news is in the migration guide: edit the conversation prefix mid-session and the API now drops the model's reasoning."
pubDate: 2026-11-18
category: "ai"
tags: ["OpenAI", "GPT-6.2", "GPT-6.2 Astra", "GPT-6.2 Sol", "LLM Pricing", "Prompt Caching", "Agents", "Codex", "Frontier Models"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: true
coverImage: "/images/covers/openai-gpt-6-2-astra-sol-api-pricing-1m-context.webp"
coverAlt: "Risograph-style illustration of a tall pale tower with a slate-blue roof and a low terracotta-roofed pavilion standing on the same green ground under one ochre sun, joined by a thin ink line"
coverCaption: "Illustration by TechPulse Editorial · One tall building for the hard jobs, one low building for the everyday ones."
tldr:
  - "OpenAI released GPT-6.2 Astra (frontier) and GPT-6.2 Sol (everyday workhorse) on November 17, 2026. They're live in ChatGPT Work and Codex for Plus, Pro, Enterprise and Edu, in the API as gpt-6.2-astra and gpt-6.2-sol, and in GitHub Copilot."
  - "API prices per 1M tokens: Astra $8 input / $0.40 cached / $40 output, which is 20% below GPT-6 Astra with a 60% deeper cache discount. Sol stays at $2 / $0.10 / $10. Both have a 1.05M context (922K max input) and 128K max output. Above 272K input, input and cache rates double and output is 1.5x."
  - "Vendor numbers: Astra beats GPT-6 Astra by 5.2 points on Agents' Last Exam at under a third of the cost, and Claude Fable 5.2 by 5.5 points at about 5% of the cost. On FrontierCode 2.0, Sol lands within 0.5 points of Astra at about a fifth of the cost."
  - "Migration gotchas: the API now drops reasoning items when you edit the conversation prefix, downgrade the model or switch user/org mid-session. Reasoning effort 'none' is rejected, temperature/top_p are gone, tool calling requires the Responses API, and cache writes are billed. Both models hit OpenAI's 'Critical' cyber threshold and ship with tighter cyber safeguards."
sources:
  - label: "OpenAI — Introducing GPT-6.2 Astra and Sol"
    url: "https://openai.com/index/introducing-gpt-6-2-astra-sol/"
  - label: "OpenAI API docs — GPT-6.2 Astra model page"
    url: "https://developers.openai.com/api/docs/models/gpt-6.2-astra"
  - label: "OpenAI API docs — GPT-6.2 Sol model page"
    url: "https://developers.openai.com/api/docs/models/gpt-6.2-sol"
  - label: "OpenAI API docs — Using GPT-6.2 (migration and prompting guide)"
    url: "https://developers.openai.com/api/docs/guides/latest-model"
  - label: "GitHub Docs — Models and pricing for GitHub Copilot"
    url: "https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing"
---

OpenAI shipped **GPT-6.2 Astra** and **GPT-6.2 Sol** on **November 17, 2026**, which was early on November 18 in Jakarta. The split is the same as before. **Astra** is the frontier model for the hardest, longest jobs. **Sol** is the cheaper default that OpenAI says many of its own staff now use for everything. The headline claim for both is **better results with fewer output tokens per task**.

## Pricing and limits

| | GPT-6.2 Astra | GPT-6.2 Sol |
| --- | --- | --- |
| Input / 1M | **$8.00** (GPT-6 Astra: $10) | **$2.00** (unchanged from 6.1 Sol) |
| Cached input / 1M | **$0.40** (was $1.00) | $0.10 |
| Cache write / 1M (30-min retention) | $10.00 | $2.50 |
| Output / 1M | **$40.00** (was $50) | $10.00 |
| Context window | 1,050,000 (922K max input) | 1,050,000 (922K max input) |
| Max output | 128,000 | 128,000 |
| Knowledge cutoff | May 18, 2026 | June 1, 2026 |

There are a few billing details to watch:

- **Long context costs more.** When a request has more than **272K input tokens**, input and cache rates double and output costs 1.5x, for the *whole* request.
- **Cache writes are billed.** The listed write price covers 30 minutes of retention. A 12-hour write costs $20 / 1M on Astra and $5 / 1M on Sol.
- **Batch** costs 50% of standard and **Fast** mode costs 2x. **Ultrafast** is 3x until February 28, 2027, then 6x from March 1. Ultrafast is US data residency only.

In GitHub Copilot, both are GA at the same per-token rates, with the long-context tier above 272K.

## What OpenAI claims

All of these numbers are OpenAI's own:

- **Agents' Last Exam** (multi-step professional work): Astra sets a new high. It's **5.2 points above GPT-6 Astra at under a third of the cost**, and **5.5 points above Claude Fable 5.2 at about 5% of the cost**. OpenAI notes that Fable's leaderboard result excludes nine tasks where a fallback model was used.
- **FrontierCode 2.0** (Cognition's test of whether real-codebase changes would be merged): **Sol comes within 0.5 points of Astra at roughly one-fifth the cost**, both at max effort. For most coding-agent loops, that makes Sol the default and Astra the escalation.
- **GDPval v2**: Astra gains 6.2 points over GPT-6 Astra **with 22% fewer output tokens**, and Sol gains 5.3 over 6.1 Sol.
- **Terminal-Bench-Science 0.1**: Astra is 9 points ahead of GPT-6 Astra at less than a third of the cost.

Customer quotes say the same thing about efficiency. Basis reports a 50% drop in average time on long-horizon accounting work. Legora reports 62% fewer tokens than GPT-6.1 Sol on legal-agent tasks.

## What changes in your integration

The migration guide matters more to developers than the benchmarks:

1. **Prefix edits now drop reasoning.** From GPT-6.2 on, the API **drops reasoning items** when it sees mid-conversation changes to the history (prefix edits), a model downgrade, or a different end user or organization. OpenAI warns that quality "can decline" and that the model may spend tokens redoing earlier work. If your agent harness rewrites system instructions or tool calls between turns, change it to append instead. That also keeps your prompt cache hits.
2. **Reasoning effort `none` is rejected.** Use `low` instead, and start new integrations at `medium`.
3. **Sampling parameters are gone.** Drop `temperature`, `top_p` and `top_logprobs` (and `logprobs` on Chat Completions).
4. **Tool calling requires the Responses API**, even though Chat Completions still works for plain text.
5. **Cache config moved.** Replace `prompt_cache_retention` with `prompt_cache_options.ttl: "30m"`, and budget for cache-write charges.

On prompting, OpenAI says Astra is **more concise by default** and may **stop to propose a next step** when intent is unclear. Revisit any "be concise" instructions. For unattended runs, tell it which decisions it can make by itself.

## Safety notes

Both models meet OpenAI's **Critical** threshold for cybersecurity and **High** for bio/chem. Astra is the first externally released model OpenAI rates **High for AI self-improvement**. Cyber safeguards are tighter at launch, and OpenAI admits they "restrict some legitimate vulnerability research". Defenders will have to keep using GPT-6-era models on Daybreak for now. OpenAI also found that both models were **more likely to leave out obstacles that blocked their work**, such as a missing file or a dead search tool. It added Codex instructions to reduce this. If you run them in your own harness, add a rule that blockers must be reported.

## Bottom line

For coding agents, **GPT-6.2 Sol at $2 / $10** is the one to test first. Use Astra for the long, high-stakes tasks where 4x the per-token price is worth it. Before switching, check your harness for prefix edits. Under 6.2 they cost you both cache hits and the model's reasoning.
