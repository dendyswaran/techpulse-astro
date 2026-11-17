---
title: "Tencent Hy4 flash: 12B Active Parameters, 1M Context, and $0.07 per Million Input Tokens"
subtitle: "Tencent's new small Hy model costs about a twentieth of Hy4 per task on Tencent's office-work benchmark and decodes at more than 150 tokens per second. Tencent says to use it for documents, slides, research and light computer use, and to keep Hy4 for serious software engineering."
pubDate: 2026-11-17
category: "ai"
tags: ["Tencent", "Hy4", "Hy4 flash", "Hunyuan", "Mixture of Experts", "LLM Pricing", "Executor Model", "Computer Use"]
readingTime: "4 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/tencent-hy4-flash-224b-12b-active-cheap-office-agent-model.webp"
coverAlt: "Risograph-style illustration of a small terracotta cube moving along a long thin rail with soft speed lines behind it, three small ochre coins beside it, and a tall slate tower standing in the distance"
coverCaption: "Illustration by TechPulse Editorial · The small one does most of the daily runs, and the tower stays for the hard jobs."
tldr:
  - "Tencent launched Hy4 flash on November 16, 2026: 224B total parameters (64B of them Engram lookup parameters), 12B active, multimodal input, and a 1M-token context."
  - "Tencent prices it at about $0.070 per 1M input tokens, $0.281 per 1M output and $0.003 per 1M cached input (CNY 0.50 / 2.00 / 0.02 on TokenHub). TokenHub has a 50% launch discount until November 30, and WorkBuddy access is free in that period."
  - "On Tencent's internal WorkIndex office benchmark it scores 42.1, slightly ahead of the 770B Hy4 Preview (39.7), at about 1/13 of Hy4 Preview's per-task cost and 1/20 of Hy4's. Tencent reports decoding above 150 tok/s."
  - "It is weaker on hard coding: 19.2 on Terminal-Bench 4.0 (Hy4: 44.4) and 64.6 on DeepSWE v1.1 (Hy4: 74.9). Weights are promised but not released, and no license has been named."
sources:
  - label: "Tencent — Tencent Launches Hy4 flash (Nov 16, 2026)"
    url: "https://www.tencent.com/tencent-launches-hy4-flash-to-power-high-speed-cost-efficient-ai-deployment-for-everyday-workflows/"
  - label: "Tencent Hy — Hy4 flash research page"
    url: "https://hy.tencent.ai/research/hy4-flash?langVersion=en"
  - label: "LLMLearner — Hy4 Flash benchmarks, appendix scores and TokenHub pricing"
    url: "https://llmlearner.com/models/hy4-flash"
  - label: "LLM Releases — model release tracker (Nov 16 entries)"
    url: "https://www.llm-releases.com/"
---

Two weeks after **Hy4**, which we covered on [launch day](/articles/tencent-hy4-cognition-swe-2-flash-cheap-agentic-coding-models), Tencent has released a smaller and much cheaper model. **Hy4 flash** went live on **November 16, 2026**. Tencent's own positioning is clear: use it for most everyday tasks, and keep the full Hy4 for long-horizon software engineering.

## Specs

- **224B total parameters**, of which **64B are Engram parameters** (a lookup-style memory module), with **12B active** per token.
- **Hybrid attention + LatentMoE + Engram.** Tencent says the KV cache is **1/6 the size of Hy4's** and 1/24 of Hy3's, which is what makes 1M-token sessions cheap to serve.
- **Multimodal input** (text and images) and a **1M-token context**.
- **More than 150 tok/s decoding**, using megakernels, 4-bit quantization and Tencent's DFly acceleration.
- Reinforcement learning reduced average end-to-end **output tokens per task by 50%**. That matters because output tokens are the expensive ones.

## Price

| Per 1M tokens | Hy4 flash | Hy4 |
| --- | --- | --- |
| Input | ~$0.070 (CNY 0.50) | $0.90 |
| Output | ~$0.281 (CNY 2.00) | $2.70 |
| Cached input | ~$0.003 (CNY 0.02) | $0.045 |

These are list prices. TokenHub (model ID `hy4-flash`) charges half price until **November 30, 2026, 12:00 Beijing time**. Hy4 flash is also live in WorkBuddy, Yuanbao, WeCom, QQ, ima and Marvis. Tencent says OpenRouter support is "coming soon".

## What Tencent measured

Tencent focused on its own **WorkIndex** benchmark: eight internal task sets covering slide creation and editing, document editing, spreadsheet repair, audio/video processing and visual Q&A. It gives less weight to public leaderboards. On WorkIndex overall, Hy4 flash scores **42.1** versus **39.7** for the 770B / 49B-active **Hy4 Preview**. Average per-task cost is about **¥0.2**, compared with ¥3.2 for Hy4 Preview and ¥5.7 for Hy4. Tencent also ran a blind test with 85 WorkBuddy users across 259 tasks. Hy4 flash scored **2.79** on satisfaction, against **2.81** for Claude Haiku 5.5, with the shortest median completion time.

The public agent benchmarks in Tencent's appendix (all vendor-reported) show where it stops being a good fit:

| Benchmark | Hy4 flash | Hy4 |
| --- | --- | --- |
| DeepSWE v1.1 | 64.6 | 74.9 |
| Terminal-Bench 4.0 | 19.2 | 44.4 |
| ProgramBench | 16.0 | 30.0 |
| APEX-Agents v1.1 | 63.1 | 75.2 |
| OSWorld 2.1 | 68.1 | 78.9 |
| HLE (with tools) | 55.2 | 59.1 |

## Where it fits

Hy4 flash is a **cheap executor**, not a coding agent. With input at about 7 cents per million tokens and cache reads at a fraction of a cent, it suits the high-volume parts of an agent pipeline: summarizing tool output, document and spreadsheet edits, research sweeps, and simple front-end or computer-use steps. A stronger model plans and does the hard coding. A Terminal-Bench 4.0 score of 19.2 means you should not give it shell-heavy software work.

**Weights aren't out yet.** Tencent "plans to open-source Hy4 flash with frequent iterations", but there is no checkpoint or license for now. Until then it is API-only.
