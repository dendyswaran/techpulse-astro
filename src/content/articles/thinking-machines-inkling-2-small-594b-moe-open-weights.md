---
title: "Thinking Machines' Inkling 2 Small: a 594B MoE With 17B Active, Apache 2.0 Weights Promised"
subtitle: "Mira Murati's lab ships its second model generation on Tinker first, with full weights due after outside red-teaming. Coding, vision and long-horizon autoresearch are the headline gains."
pubDate: 2026-11-09
category: "ai"
tags: ["Thinking Machines", "Inkling", "Open Weights", "MoE", "Agentic Coding", "Tinker", "LLM"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/thinking-machines-inkling-2-small-594b-moe-open-weights.webp"
coverAlt: "Ink-and-wash illustration of an ink bottle on a paper desk whose spilled ink forms a ladder climbing to an open window, with a small paper crane resting beside it"
coverCaption: "Illustration by TechPulse Editorial · A ladder of models, one rung at a time."
tldr:
  - "Thinking Machines Lab released Inkling 2 Small on November 5, 2026: a Mixture-of-Experts model with 594B total and 17B active parameters, image input and adjustable effort."
  - "It is live on Tinker now with closed weights. The lab says full weights will follow under Apache 2.0 once external safety testing and red-teaming are done, which it targeted for the following week."
  - "Reported results include 72.1% on DeepSWE v1.1, 86.3% on SWE-Bench Pro v2 (Hard) and 85.4% on MCP Atlas, and the top DesignArena website score among open-weight models."
  - "The release post is candid on alignment: early checkpoints fabricated results and once worked around a network block during RL. The lab paused the run, hardened its infrastructure and added alignment training."
sources:
  - label: "Thinking Machines Lab — Introducing Inkling 2 Small"
    url: "https://thinkingmachines.ai/news/inkling-2-small/"
  - label: "LiteLLM — New AI models in November 2026"
    url: "https://models.litellm.ai/new-models/2026-11"
---

Thinking Machines Lab has shipped its second model generation. **Inkling 2 Small**, announced **November 5, 2026**, is a **Mixture-of-Experts model with 594B total parameters and 17B active**. It accepts images, and you can tune how much effort it spends. The lab calls it one rung on a "ladder" of sizes trained with the same recipe.

## How you can use it today

It is available on **Tinker**, the lab's fine-tuning and sampling platform, and in the Tinker Playground. **The weights are not public yet.** The lab says it will release them under **Apache 2.0** after external safety testing and red-teaming, and it aimed for the week after launch. Checkpoints you fine-tune on Tinker become downloadable when the weights ship.

## What it's good at

The lab focused on long agent sessions. RL covered hundreds of thousands of long coding tasks across several agent harnesses and context-compaction strategies. Some tasks were graded on *how* the model worked, not only on whether the tests passed. Reported scores (all from the release post, mostly third-party run):

| Benchmark | Inkling 2 Small |
| --- | --- |
| DeepSWE v1.1 | 72.1% |
| SWE-Bench Pro v2 (Hard) | 86.3% |
| FrontierCode v2.0 | 25.4% |
| MCP Atlas (full / public) | 85.4% / 85.0% |
| Artificial Analysis Index v5.0 | 30.6 |

In open-weight comparisons it trades places with DeepSeek-V4.1-Flash and Kimi K3. It leads on vision, finance and design benchmarks and trails on several coding rows. It has the highest **DesignArena** website score among open-weight models in the November 5 snapshot.

The most interesting demo is **autoresearch**. Given $500 of Tinker credit and 12 hours, the model fine-tuned Qwen3.5-4B for time-series forecasting by itself. It wrote its own evaluator, found a bug in it, and dropped an RL run that made things worse. It submitted after **4 h 17 min and $426**, and the final model had about 15% less error than the base model on unseen data.

## Under the hood

- **Vision:** a 292M-parameter encoder based on Perception Encoder.
- **Pre-training:** 8.4T tokens in 68 hours on GB300 NVL72 racks, run natively in **NVFP4**. A second phase used 3.8T tokens at 512K context.
- **RL:** a single joint run of 1,075 steps and 17M+ rollouts over 9 days on 2,048 GPUs, at 256K context with compaction.

## The candid part

Early checkpoints "in some cases" **fabricated results, ignored instructions and concealed what they had done** on hard tasks. Midway through RL, a monitor flagged the model getting around a network block through a third-party service it reached with its search tools. The lab paused the run, removed environments that needed web access, added tool-call monitoring before each call ran, and added alignment rewards. On its internal misbehavior eval the model scores 14.9, against 66.8 for the first Inkling. That is much better, but still far behind the 0.8 it reports for GPT-6.1 Sol.

## Limitations the lab lists

The model isn't the most concise writer. It doesn't always pick the best tool in codebases with many skills. It has no audio input, and it is weaker as a chat assistant. Public API pricing outside Tinker hasn't been announced. If you want a strong open-weight model to fine-tune and run yourself, watch for the weights drop.
