---
title: "Gemini 4 Neon: Google's $3 / $15 Middle Tier Built to Orchestrate Hydrogen Subagents"
subtitle: "Neon slots between Hydrogen and Carbon: 1M-token unified context, four thinking levels, flat pricing across the window, and #1 on the Artificial Analysis Coding Agent Index by Google's account. It's paid-tier only and drops explicit context caching."
pubDate: 2026-11-19
category: "ai"
tags: ["Gemini", "Google DeepMind", "Gemini 4 Neon", "Coding Agents", "Model Routing", "Antigravity", "Pricing"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/gemini-4-neon-mid-tier-frontier-coding-model-3-15-pricing.webp"
coverAlt: "Soft gouache illustration of three stacked stone shelves, the middle one holding a single muted coral glass tube that glows faintly between a small sage sphere below and a large slate block above"
coverCaption: "Illustration by TechPulse Editorial · The middle shelf."
tldr:
  - "Google released Gemini 4 Neon (model ID gemini-4-neon) on November 18, 2026. It sits between Gemini 4 Hydrogen (fast executor) and Gemini 4 Carbon (hardest problems), aimed at complex coding, knowledge work and science tasks that run often."
  - "Pricing is flat across the 1M-token window: $3 per 1M input tokens, $0.15 per 1M cached input (implicit caching only, 95% off), $15 per 1M output including thinking. It's on the paid tier of the Gemini API only, not the free tier."
  - "Google reports #1 on the Artificial Analysis Coding Agent Index (58.6), 65.2% on Terminal-Bench 4.1, 61 on the Artificial Analysis Intelligence Index at xhigh, and 32% lower cost per task than Carbon at the default high thinking level (all vendor-reported)."
  - "Migration notes: default thinking level is high (xhigh available, minimal rejected), synchronous output is capped at 65,536 tokens (use background mode for up to 1M), temperature/top_p/top_k are ignored, and explicit cachedContents is not supported."
sources:
  - label: "Google — Introducing Gemini 4 Neon"
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/"
  - label: "Google AI Studio — What's new in Gemini 4 Neon"
    url: "https://aistudio.google.com/docs/whats-new-gemini-4-neon"
  - label: "Google AI Studio — Gemini 4 Neon model page"
    url: "https://aistudio.google.com/docs/models/gemini-4-neon"
  - label: "Google Cloud — Developer's guide to Gemini 4 Neon"
    url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/guides/gemini-4-neon"
---

Google has finished filling in the Gemini 4 lineup. After **Carbon** (deep, long-horizon work) and **Hydrogen** (fast, cheap execution), **Gemini 4 Neon** arrived on **November 18, 2026** as the middle tier. Google pitches it as frontier-level reasoning for complex work that runs **often**, where Carbon is too slow or expensive to use on every call.

It's rolling out in the Gemini API (paid tier, `generateContent` and the Interactions API), Google AI Studio, Android Studio, Gemini for business, Google Antigravity for paid AI Pro and Ultra subscribers, and the Gemini app for Pro and Ultra.

## Price and limits

| | Gemini 4 Neon |
| --- | --- |
| Model ID | `gemini-4-neon` |
| Input / 1M tokens | **$3.00** |
| Cached input / 1M tokens | **$0.15** (implicit caching, prompts ≥ 4,096 tokens) |
| Output / 1M tokens (incl. thinking) | **$15.00** |
| Context | 1,048,576 tokens, shared by input, thinking and output |
| Output per request | 65,536 synchronous; up to ~1M with `background: true` |
| Thinking levels | `low`, `medium`, `high` (default), `xhigh` |
| Free tier | No |

Pricing is flat across the whole window, with no long-context surcharge. For reference, our [Hydrogen coverage](/articles/gemini-4-hydrogen-fast-executor-model-antigravity-orchestrator) lists Hydrogen at $1.50 / $7.50. Carbon is $2 / $10 at its introductory price, rising to $4 / $20 on December 1.

## What Google claims

All numbers below are vendor-reported:

- **Coding:** #1 on the Artificial Analysis **Coding Agent Index (58.6)**, **65.2%** on Terminal-Bench 4.1, **46.2%** on FrontierCode 2.0 at the default high setting. On SWE-sweep it scores 12.8% in the mini-SWE harness and **39.0%** in Antigravity's own harness. That gap is as much about the harness as the model.
- **General:** **61** on the Artificial Analysis Intelligence Index at xhigh (#3 overall), #2 on the Vals Index (70.9%), and #2 on Arena's new Agent Arena Index (1336).
- **Cost per task:** at high, **32% lower** than Carbon, and roughly 50–80% lower than top competing frontier models on Vals and Agent Arena, per Google.
- **Agent behavior:** fewer redundant file reads, reliable context compaction in long sessions, 0.0% cheating on Terminal-Bench 4.0 and a 2.45% shortcut rate on Google's coding-cheating eval.

Google frames Neon as the **orchestrator** model: it can work alone or direct parallel **Hydrogen subagents** in Antigravity. The Antigravity agent in Gemini Managed Agents supports Neon on its own or paired with Hydrogen. A security-tuned **Neon for cyber** is going to vetted defenders through the Fairwind Program over the next few days.

## Migration gotchas

If you're moving from Gemini 3.x, or even from Carbon, read the migration notes before you swap the model string:

1. **Thinking defaults change.** Neon defaults to `high` and supports `xhigh`. Carbon and Argon default to `medium` and cap at `high`. `minimal` returns an error.
2. **Output cap.** One synchronous request returns at most 65,536 tokens, and `max_output_tokens` covers thinking plus answer. Remove old caps like 8,192. For longer output, set `background: true` with a higher `max_output_tokens`.
3. **No explicit caching.** `cachedContents` / `caches.create` aren't supported, so remove `cached_content`. Implicit caching applies automatically.
4. **Sampling knobs are ignored.** In-range `temperature`, `top_p` and `top_k` are ignored, and out-of-range values return a 400.
5. **Declare tools natively.** Prompting for raw-text JSON tool calls with no declared tools can return `MALFORMED_FUNCTION_CALL`.
6. **Raise client timeouts** to at least 15 minutes, or use background execution. Hard prompts can take minutes.

## Where it fits

For a planner/executor setup, Neon is the obvious **planner or reviewer** over Hydrogen workers when Carbon is overkill. At $3 / $15 it costs twice as much as Hydrogen per token, so it's worth testing whether fewer steps and fewer redundant reads actually make it cheaper **per task** on your own workload, as Google claims. Run your evals at each thinking level and pick the lowest one that clears your quality bar. Google's docs recommend exactly that.
