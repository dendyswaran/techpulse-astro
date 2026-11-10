---
title: "Meta Muse Ember: A $0.10-per-Million Subagent Model With a 1M-Token Context"
subtitle: "Meta Superintelligence Labs' smallest model matches Claude Haiku 5.5 on the Artificial Analysis index at about a third of the cost per task. It is built to do the volume work while a bigger model plans."
pubDate: 2026-11-10
category: "ai"
tags: ["Meta", "Muse Ember", "Small Models", "Subagents", "Agentic Coding", "Pricing", "Multimodal"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/meta-muse-ember-cheap-subagent-model-1m-context.webp"
coverAlt: "Risograph-style illustration of long wooden shelves holding dozens of identical small grey lanterns, each with a warm ochre glow and a few glowing terracotta, on cream paper"
coverCaption: "Illustration by TechPulse Editorial · Small lights, many of them, doing the routine work."
tldr:
  - "Meta Superintelligence Labs released Muse Ember (muse-ember-1.0) on November 9, 2026: its smallest, cheapest model, aimed at tool calls, coding subtasks, routing, extraction and long-document parsing."
  - "Pricing is $0.10 per million input tokens, $0.004 cached and $0.50 output for prompts up to 200K tokens ($0.30 / $0.012 / $1.50 above that), with a 1M-token context and up to 512K output tokens."
  - "Artificial Analysis scores it 36 on its Intelligence Index, level with Claude Haiku 5.5 at max effort, at about $0.14 per index task, roughly a third of Haiku's cost. It trails Haiku on FrontierCode 2.0-AA (27.2 vs 34.9)."
  - "Meta pitches it as the executor under Muse Wonder: 'Muse Wonder plans, Muse Ember handles the volume.' It takes text, images, audio and video, and is on the Meta Model API, Muse Code, Google Cloud and Oracle Cloud."
sources:
  - label: "Meta AI — Introducing Our Smallest, Most Efficient Model: Muse Ember"
    url: "https://research.meta.ai/blog/muse-ember"
  - label: "TechCrunch — Meta releases Muse Ember, a new lightweight model for agent execution"
    url: "https://techcrunch.com/2026/11/09/meta-releases-muse-ember-a-new-lightweight-model-for-agent-execution/"
  - label: "Artificial Analysis on X — Muse Ember scores 36 on the Intelligence Index"
    url: "https://x.com/ArtificialAnlys/status/2119854348587123007"
---

On the same day Anthropic made its frontier tier cheaper, **Meta Superintelligence Labs** went after the other end of the agent stack. **Muse Ember**, released **November 9, 2026**, is the fourth Muse model, after Spark (April), the open-weight Glimmer (August) and the frontier Wonder (October). Meta says it is the first model trained using **Muse Wonder Full**.

The pitch is narrow on purpose. Ember is built for "the work agents repeat all day": tool calls, coding subtasks, routing, extraction and long document parsing. Its job is to be the cheap subagent in someone else's harness.

## Specs and pricing

| | Muse Ember |
| --- | --- |
| API model ID | `muse-ember-1.0` |
| Input / cached / output (≤200K prompt) | **$0.10 / $0.004 / $0.50** per MTok |
| Input / cached / output (>200K prompt) | $0.30 / $0.012 / $1.50 per MTok |
| Context / max output | **1M / 512K** tokens |
| Modalities | Text, images, audio, video in |
| APIs | Meta Model API (Responses API supported), Muse Code, Google Cloud, Oracle Cloud |

The list price matches Claude Haiku 5.5's entry rate. The cached-input price, **$0.004 per million**, is very low, which matters in agent loops that re-read the same prefix every turn.

## Benchmarks: strong on agents, weaker on mergeable code

Meta's table compares Ember at max reasoning effort with Claude Haiku 5.5 and GPT-6 Luna:

- **Artificial Analysis Intelligence Index:** 36, tied with Haiku 5.5 (Luna: 28), at **$0.14 per task** versus about $0.41 for Haiku at max.
- **AutomationBench-AA** (end-to-end business workflows): 37.8 vs 13.9 (Haiku) and 20.2 (Luna).
- **Terminal-Bench 4.0:** 40.9 vs 39.2, each model in its best published harness (mini-swe-agent for Ember).
- **OSWorld 2.1** (partial credit): 69.5 vs 68.9.
- **FrontierCode 2.0-AA:** **27.2 vs 34.9 for Haiku.** When the question is whether maintainers would merge the change, Haiku still wins.

Against Meta's own mid-tier **Muse Spark 1.3**, Ember scores 36 to Spark's 37 on the index, at $0.14 versus $2.39 per index task.

Partner quotes repeat the speed story. Cloudflare reports up to **30% faster tail latency** than the comparable model it tested. You.com measured a **p95 of 2.2 seconds** on its coding quests, with 36–48% fewer output tokens than leading open-weight models.

## Where it fits

Meta's own framing is a two-tier harness: *"Muse Wonder plans, Muse Ember handles the volume."* In practice that means:

- **Explorer / reader subagents** that grep, summarize files and parse logs, then return short notes to a more expensive planner.
- **Extraction over long documents.** The 1M context plus native vision means scanned PDFs, charts and screenshots don't need a separate OCR model.
- **High-volume classification and routing**, where outputs can be checked cheaply.

It is a weaker fit for the final code edit on a hard change. The FrontierCode gap suggests keeping that step on a stronger model.

## Caveats

- Most results come from Meta's own evaluations or from Artificial Analysis runs at **max** reasoning effort. Test Ember at the effort setting you will actually run.
- Pricing triples above 200K prompt tokens, so a subagent that piles up context quietly gets 3x more expensive. Compact or reset before you cross that line.
- Ember is API-only. Unlike Glimmer, there are no open weights.

## Bottom line

If your agent bill is mostly subagents reading files, Ember is worth a side-by-side test against Haiku 5.5 on your own traffic. Compare **cost per completed task**, not price per token.
