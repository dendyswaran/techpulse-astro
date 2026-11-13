---
title: "Gemini 4 Hydrogen: Google's $1.50 Executor Model, Built to Work Under Carbon"
subtitle: "Hydrogen is the fast, cheap tier of Gemini 4: 1M-token context, up to 1M output tokens, four thinking levels and flat $1.50 / $7.50 pricing. Google also launched Orchestrator in Antigravity, which switches between Carbon and Hydrogen inside one session."
pubDate: 2026-11-13
category: "ai"
tags: ["Gemini", "Google DeepMind", "Gemini 4 Hydrogen", "Model Routing", "Agents", "Antigravity", "Pricing"]
readingTime: "4 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: true
coverImage: "/images/covers/gemini-4-hydrogen-fast-executor-model-antigravity-orchestrator.webp"
coverAlt: "Gouache-style illustration of one large terracotta disc on a slate plinth, linked by thin ink arcs to a row of six small sage and ochre discs resting on a long ledge"
coverCaption: "Illustration by TechPulse Editorial · One planner, many hands."
tldr:
  - "Google released Gemini 4 Hydrogen on November 12, 2026 as the fast execution tier under Gemini 4 Carbon and Argon. Model ID: gemini-4-hydrogen."
  - "Pricing is flat across the whole 1M-token window: $1.50 per 1M input tokens, $7.50 per 1M output (thinking included), $0.075 per 1M for implicit cache reads. Explicit context caching isn't supported."
  - "Google says Hydrogen scores 51 on the Artificial Analysis Intelligence Index at its default high thinking level (54 at the new xhigh), just ahead of Argon's 50, and hits 57% on Terminal-Bench 4.1 versus 18.2% for Gemini 3.8 Flash (vendor-reported)."
  - "The new Orchestrator in Google Antigravity switches between Carbon and Hydrogen within one session. Google reports near-Carbon success on Terminal-Bench 4.0 with 24% less quota and 19% faster runs."
sources:
  - label: "Google — Introducing Gemini 4 Hydrogen"
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/"
  - label: "Google — Gemini 4 Hydrogen for developers"
    url: "https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-4-hydrogen/"
  - label: "Gemini API pricing (Gemini 4 Hydrogen)"
    url: "https://aistudio.google.com/docs/pricing"
  - label: "LiteLLM — Gemini 4 Hydrogen pricing and day 0 support"
    url: "https://docs.litellm.ai/blog/gemini-4-hydrogen"
---

Two weeks after **Gemini 4 Carbon**, Google has filled in the bottom of the Gemini 4 lineup. **Gemini 4 Hydrogen** came out on **November 12, 2026**. Google positions it plainly as the model that does the work: Carbon and Argon handle deep, long-horizon reasoning, and Hydrogen handles "rapid execution" (writing code, running tests, checking changes).

It's available today in the Gemini API and AI Studio (model ID `gemini-4-hydrogen`), Android Studio, Gemini for business, the Gemini app, Google Search, and Google Antigravity for paid AI Pro and Ultra subscribers.

## Price and limits

| | Gemini 4 Hydrogen | Gemini 4 Carbon (intro price) |
| --- | --- | --- |
| Input / 1M tokens | **$1.50** | $2.00 ($4.00 from Dec 1) |
| Output / 1M tokens (incl. thinking) | **$7.50** | $10.00 ($20.00 from Dec 1) |
| Cached input / 1M | **$0.075** (implicit only) | $0.10 |
| Context / max output | 1M / 1M tokens | 1M / 1M tokens |

The price is the same across the whole 1M-token window, with no surcharge for long prompts. Batch and Flex are half price ($0.75 / $3.75), and Priority costs $2.70 / $13.50, per LiteLLM's day-0 pricing notes.

Caching works differently from Carbon. Hydrogen supports **implicit caching only**, with a **4,096-token minimum prefix**. You can't create a `cached_content` object. To get cache hits, keep the system prompt, tool definitions and reference docs at the top of the request, unchanged between calls.

## Four thinking levels

Hydrogen has **low, medium, high (default) and xhigh** thinking levels. Google's headline claim is that at the default level it edges out its own Argon on the Artificial Analysis Intelligence Index (**51 vs 50**), and reaches **54** at xhigh. Other figures Google reports against Gemini 3.8 Flash:

- **Terminal-Bench 4.1:** 57% vs 18.2%
- **2.5x faster** task completion at the default setting
- **More than 5x fewer** fabricated claims
- Partners saw **2x–2.8x faster** runs with **12–23% fewer tokens**, partly because the model batches file reads and searches in parallel instead of reading files one at a time

All of these are vendor-reported. Treat them as a reason to run your own comparison, not as a result.

## Orchestrator: routing built into the IDE

The more interesting part for agent builders is **Orchestrator** in Google Antigravity. Instead of picking one model per session, Orchestrator switches between **Carbon and Hydrogen within the same session**. On Terminal-Bench 4.0, Google says it got close to Carbon's success rate while using **24% less quota** and finishing **19% faster**.

For parallel work, Google describes a familiar pattern: **Carbon as coordinator, Hydrogen as the worker and verifier agents**, each building and testing changes in its own isolated workspace. It's the same planner/executor split many teams already build by hand. The difference is that the vendor now ships it as the default way to use its models.

## Safety numbers worth noting

Google says Hydrogen reduces agentic "overreach" by up to 81%, is up to 2x less likely to bypass permission boundaries on blocked tasks, and is **2.3x more resilient** on the Gray Swan indirect prompt injection benchmark than 3.8 Flash. These numbers matter more for a cheap model, because cheap models are the ones you run unattended in large numbers.

## What to do with it

- **If you route models yourself**, Hydrogen is a new candidate for your executor/subagent slot. At $1.50 / $7.50 it's well under Carbon's post-December price, so test it against your current cheap tier on your own tasks before switching.
- **Move stable context to the front of the request.** With implicit-only caching, a stable prefix decides whether you pay $1.50 or $0.075 per million input tokens.
- **Start at the default level**, and use xhigh only on tasks where a check (tests, a verifier) shows that low or high fails.
