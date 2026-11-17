---
title: "Qwen4-Max: Alibaba's 2.4T-Parameter MoE Ships With a 1M Context at $1.50 / $4.50 per Million Tokens"
subtitle: "Alibaba's new flagship keeps the 2.4T scale of Qwen3.8-Max but activates 25% fewer parameters per token, and it costs less. Its strongest results are on long-horizon agent benchmarks. On terminal coding it still trails Opus 5.5, GPT-6.1 Sol and Kimi K3.1."
pubDate: 2026-11-17
category: "ai"
tags: ["Alibaba", "Qwen", "Qwen4-Max", "Mixture of Experts", "LLM Pricing", "Agents", "1M Context", "Frontier Models"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: true
coverImage: "/images/covers/alibaba-qwen4-max-2-4t-moe-1m-context-api-pricing.webp"
coverAlt: "Risograph-style illustration of a long colonnade of pale cream columns standing on a very long plinth, with only three of the columns painted in ochre"
coverCaption: "Illustration by TechPulse Editorial · A very large building where only a few columns carry each step."
tldr:
  - "Alibaba released Qwen4-Max on November 16, 2026. It is a 2.4T-parameter sparse MoE with 71B active per token (25% fewer than Qwen3.8-Max at the same scale), native image and video input, and a 1M-token context."
  - "List price on QwenCloud (international) is $1.50 per 1M input tokens and $4.50 per 1M output, with cached reads at $0.075. That is cheaper than Qwen3.8-Max ($2 / $6)."
  - "Alibaba says it uses 35% fewer tokens than Qwen3.8-Max at High reasoning effort and cuts average cost per task by about 60% on its internal Work360 benchmark. Its best published result is 46.7 on Agents' Last Exam v1.1, ahead of Opus 5.5 (43.4)."
  - "Coding is mixed. It scores 75.7 on DeepSWE v1.1, level with the Western flagships, but only 48.5 on Terminal-Bench 4.0, behind Opus 5.5 (59.6), GPT-6.1 Sol (56.1) and Kimi K3.1 (67.2). All scores are vendor-reported. The Max model has no open weights. Smaller open-weight Qwen4 models are promised \"soon\"."
sources:
  - label: "Alibaba Cloud — Alibaba Unveils Qwen4-Max (press release, Nov 16, 2026)"
    url: "https://www.alibabacloud.com/en/press-room/alibaba-unveils-qwen4-max"
  - label: "QwenCloud — Qwen4-Max model page (pricing, limits)"
    url: "https://www.qwencloud.com/models/qwen4-max"
  - label: "QwenCloud docs — Model pricing"
    url: "https://docs.qwencloud.com/developer-guides/getting-started/model-prices"
  - label: "Alibaba Cloud Model Studio — Model releases and updates"
    url: "https://docs.modelstudio.console.alibabacloud.com/en/model-studio/newly-released-models"
  - label: "DataCamp — Qwen4-Max: Features, Benchmarks, and Pricing"
    url: "https://www.datacamp.com/blog/qwen4-max"
---

Alibaba moved its flagship to a new generation on **November 16, 2026**. **Qwen4-Max** went from a Token-Plan-only preview (November 11) to general availability on QwenCloud and Alibaba Cloud Model Studio. Alibaba bills it as an "AI teammate" for long-running work, and its published numbers support that pitch more than they support a coding pitch.

## What changed in the architecture

Qwen4-Max is the same size as its predecessor, **2.4 trillion total parameters**. The difference is how much of it runs on each token: **71B active**, which Alibaba says is 25% fewer than Qwen3.8-Max. According to the press release, the new Qwen4 architecture changes the sparse MoE design "across attention, residual connections, and embeddings". Alibaba hasn't published a technical report with more detail yet.

Other specs from the QwenCloud model page:

| | Qwen4-Max |
| --- | --- |
| Context | 1M tokens (max input 991K, or 983K with thinking on) |
| Max output | 131K without thinking, 262K with thinking (reasoning included) |
| Input | Text, images, video |
| API compatibility | OpenAI- and Anthropic-compatible, tool calling, structured output, web search |

DataCamp points out that the output limit isn't documented consistently: one QwenCloud page lists 393K. **Check the limit for your endpoint before you set `max_tokens`.**

## Pricing

| Per 1M tokens (international list) | Qwen4-Max | Qwen3.8-Max |
| --- | --- | --- |
| Input | $1.50 | $2.00 |
| Output | $4.50 | $6.00 |
| Cached input (implicit or explicit read) | $0.075 | — |
| Explicit cache write (5 min / 1 h) | $1.875 / $3.00 | — |

For comparison, DataCamp lists Claude Opus 5.5 at $4 / $20 and GPT-6.1 Sol and Kimi K3.1 at $2 / $10. Qwen4-Max's output price is about 22% of Opus 5.5's. Alibaba's own efficiency claim is on top of that: on its internal **Work360** benchmark (721 industry fields), Qwen4-Max uses **35% fewer tokens** than Qwen3.8-Max at High effort and costs **about 60% less per task**.

## Benchmarks: strong on agent work, weaker in the terminal

These numbers come from Alibaba's launch chart, as compiled by DataCamp. All are vendor-reported.

| Benchmark | Qwen4-Max | Qwen3.8-Max | Opus 5.5 | GPT-6.1 Sol | Kimi K3.1 |
| --- | --- | --- | --- | --- | --- |
| Agents' Last Exam v1.1 | **46.7** | 27.9 | 43.4 | 42.6 | n/a |
| AutomationBench-AA | 72.5 | 56.2 | 69.5 | 64.9 | **73.3** |
| DeepSWE v1.1 | **75.7** | 69.3 | 74.2 | 75.2 | 75.5 |
| Terminal-Bench 4.0 | 48.5 | 38.9 | 59.6 | 56.1 | **67.2** |
| ProgramBench | 31.5 | 28.0 | **65.0** | 52.5 | 25.0 |

The 18.8-point gain on Agents' Last Exam, a long-horizon task benchmark, is the result that stands out. Alibaba's examples point the same way: a **48-hour continuous agent run** that went through four design-synthesize-test loops to find an experimentally validated chip coolant molecule, and an Alzheimer's research workflow with **454 tool calls**. It also ranked **6th on Code Arena**.

Terminal-heavy coding is where it falls behind. A **48.5 on Terminal-Bench 4.0** puts it fifth of the six models Alibaba charted. If your agents mostly run shell loops, Qwen4-Max is a cheap planner or knowledge-work model, not an obvious replacement for your coding executor.

## How to try it

The model ID is `qwen4-max` on QwenCloud and Model Studio (`dashscope/qwen4-max` in LiteLLM). It is also in QwenWork and QwenStudio. Because the API is Anthropic-compatible, you can point Claude-style harnesses at it with a base-URL change and run your own evals before switching any traffic.

**The Max model has no open weights.** Alibaba says "open-weight, smaller-scale models from the Qwen4 series will soon be released", but it gave no date or sizes.

## Bottom line

Qwen4-Max is cheaper than the model it replaces and claims better results on long, tool-heavy agent tasks. That makes it a good candidate for the **planner or long-running research agent** role in a routed setup. Test it on your own terminal and coding tasks before you rely on it there. Alibaba's own chart shows it behind the leading models on that kind of work.
