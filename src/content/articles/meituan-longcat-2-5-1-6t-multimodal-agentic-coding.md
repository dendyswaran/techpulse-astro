---
title: "Meituan's LongCat-2.5: A 1.6T-Parameter Multimodal Agent Model at $0.30 / $1.20 per Million Tokens"
subtitle: "Trained entirely on Chinese domestic accelerators, LongCat-2.5 adds native vision to Meituan's trillion-parameter line. Its self-reported coding-agent scores land between Claude Opus 4.8 and Opus 5, with a 1M-token context and an Anthropic-compatible API."
pubDate: 2026-11-03
category: "ai"
tags: ["Meituan", "LongCat", "LongCat-2.5", "MoE", "Agentic Coding", "Multimodal", "Terminal-Bench", "LLM Pricing", "China AI"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
tldr:
  - "Meituan released LongCat-2.5 on November 2: a native multimodal MoE with 1.6 trillion total parameters and about 48B active per token, built for long-horizon agent work and trained entirely on domestic Chinese compute."
  - "On the LongCat API it has a 1M-token context, up to 128K output tokens, and limited-time pricing of $0.30 per 1M uncached input, $0.006 cached and $1.20 output. It exposes both OpenAI- and Anthropic-compatible endpoints."
  - "Meituan's own benchmark table puts it at 88.4 on Terminal Bench v2.1 and 38.5 on v4.0 (Claude Opus 5: 89.1 / 53.9). Meituan says it mostly lands between Claude Opus 4.8 and Opus 5. None of these scores are independently verified yet."
  - "It's API-only for now. TechNode reports that GitHub and Hugging Face releases are planned."
sources:
  - label: "LongCat — Introducing LongCat-2.5 (technical blog)"
    url: "https://longcat.ai/blog/longcat-2.5"
  - label: "LongCat API Docs — LongCat-2.5 pricing"
    url: "https://longcat.ai/platform/docs/pricing/longcat-2.5"
  - label: "LongCat API Docs — Quick Start (endpoints, context limits)"
    url: "https://longcat.ai/platform/docs/"
  - label: "LongCat API Docs — Change Log"
    url: "https://longcat.ai/platform/docs/change-log"
  - label: "Meituan Newsroom — 美团发布LongCat-2.5大模型 (Nov 2, 2026)"
    url: "https://www.meituan.com/news/NN261102280001343"
  - label: "TechNode — Meituan launches LongCat-2.5 multimodal AI model for extended coding tasks"
    url: "https://technode.com/2026/11/02/meituan-launches-longcat-2-5-multimodal-ai-model-for-extended-coding-tasks/"
---

Meituan, best known as China's food-delivery giant, released **LongCat-2.5** on November 2. It's a native multimodal model built for one job: long-running agent tasks, especially coding. It's also cheap. It went live on the LongCat API the same day at **$0.30 per million input tokens and $1.20 per million output tokens**, under limited-time pricing.

## What it is

- **Architecture:** a mixture-of-experts model with **1.6 trillion total parameters** and roughly **48 billion activated per token**, built on LongCat-2.0, the trillion-parameter model Meituan released in June.
- **Native multimodality:** images are turned into multi-level **discrete tokens**, using residual vector quantization over native-resolution features, so the same backbone handles vision and text in one token stream. Meituan says this supports visual coding, creative design and 3D tasks.
- **Domestic compute:** Meituan's newsroom says training ran **entirely on Chinese domestic accelerators**. That included mid-training on sequences up to 1M tokens across "several trillion" tokens.

## How Meituan trained it for agents

Most of the technical blog is about long-horizon reinforcement learning:

- **Synthetic environments from real PRs.** Meituan filters GitHub pull requests and linked issues, then uses agents to build task environments that are validated with fail-to-pass and pass-to-pass tests.
- **Failures become training data.** Real agent failure trajectories are turned into "reproducible, verifiable training tasks" that target capability gaps.
- **Anti-reward-hacking.** Task environments have no network access, git history and caches are stripped, and an LLM judge audits trajectories for exploits. There are also penalties for repetitive reasoning and repeated tool calls.
- **Mixed harnesses.** Meituan trains across several agent scaffolds at once, and the change log says the model works with Claude Code, Codex and Hermes.

On the systems side, Meituan reports **86% higher per-device throughput** than a DDP baseline for long-sequence SFT. Its W4A4 (4-bit weights and activations) inference setup, compared with a W8A8 INT8 baseline, shows about **43% higher prefill and decode throughput** and roughly 16% lower time-to-first-token in online stress tests.

## Benchmarks (vendor-reported)

Selected rows from Meituan's table. Competitor numbers marked with an asterisk in the original come from public reports. The rest are Meituan's own runs, which it calls "indicative only."

| Benchmark | LongCat-2.5 | LongCat-2.0 | GPT-5.6-Sol | Claude Opus 4.8 | Claude Opus 5 |
|---|---|---|---|---|---|
| Terminal Bench v2.1 | 88.4 | 70.8 | 88.8 | 74.6 | 89.1 |
| Terminal Bench v4.0 | 38.5 | 3.0 | 37.3 | 23.6 | 53.9 |
| DeepSWE v1.1 | 64.6 | 9.7 | 72.7 | 59.0 | 68.8 |
| NL2Repo | 60.5 | 40.9 | 56.8 | 69.7 | 75.3 |
| MCP Atlas | 83.1 | 61.8 | 81.8 | 82.2 | 85.8 |
| BrowseComp | 91.9 | 79.9 | 90.4 | 84.3 | 90.8 |
| 3DCodeBench Text→3D | 55.4 | – | 52.3 | 52.7 | 54.3 |

The jump over LongCat-2.0 on the newer, harder agent benchmarks is large (Terminal Bench v4.0 goes from 3.0 to 38.5, DeepSWE from 9.7 to 64.6). Meituan's newsroom describes the result as sitting between Claude Opus 4.8 and Opus 5, ahead of Opus 5 on some tests. That's roughly what the table shows, but Opus 5 still leads clearly on Terminal Bench v4.0 and NL2Repo. Several coding results were run in the **Claude Code harness** (v2.1.280, 512K max sequence).

## Pricing and API

From the LongCat API docs:

| | Limited-time price per 1M tokens |
|---|---|
| Uncached input | $0.30 (¥2) |
| Cached input | $0.006 (¥0.04) |
| Output | $1.20 (¥8) |

- **Context:** 1M-token window (1,048,576), with up to **128K** output tokens.
- **Endpoints:** OpenAI-compatible (`https://api.longcat.chat/openai`, `/v1/chat/completions`) and Anthropic-compatible (`https://api.longcat.chat/anthropic`, `/v1/messages`). The Anthropic endpoint is what makes it easy to drop into Claude Code-style harnesses.
- Meituan notes that prices are subject to change. The figures above are discounts, not list prices.

## Should you try it?

If you run coding agents at volume and are open to a non-US provider, LongCat-2.5 is worth a cheap evaluation. Run it on your own tasks first, since every published number so far comes from Meituan. Two caveats: the weights aren't public yet (TechNode reports GitHub and Hugging Face releases are planned), and the low price is explicitly temporary.
