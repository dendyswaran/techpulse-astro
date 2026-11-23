---
title: "Inkling 2 Mini: Thinking Machines Releases a 26B Looped Transformer That Runs on a Laptop"
subtitle: "The new open-weight model runs its middle 12 layers three times per token, giving 3.4B active parameters the depth of a bigger network. Thinking Machines says it leads every open model under 100B parameters on DeepSWE v1.1 and fits in about 20 GB, with Apache 2.0 weights on Hugging Face."
pubDate: 2026-11-23
category: "ai"
tags: ["Thinking Machines", "Inkling 2 Mini", "Open Weights", "Looped Transformer", "MoE", "Local LLM", "Agentic Coding"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/thinking-machines-inkling-2-mini-looped-transformer-open-weights-laptop.webp"
coverAlt: "Muted editorial illustration of a small stack of paper layers with a ribbon looping three times through the middle layers before exiting at the top"
coverCaption: "Illustration by TechPulse Editorial · Same layers, three passes."
tldr:
  - "Thinking Machines Lab released Inkling 2 Mini on November 20, 2026, under Apache 2.0. It's a multimodal (text + image in, text out) MoE with 26.4B total and 3.4B active parameters and a context window of up to 1M tokens."
  - "It's a looped transformer: of its 24 layers, the middle 12 run three times with shared weights, for 48 layer applications per token. Each extra pass adds about 1.0B effective active parameters, so a token costs about 5.4B active."
  - "Vendor-reported scores: 48.2% on DeepSWE v1.1, 77.9% on SWE-Bench Pro v2 (Hard) and 82.7% on MCP Atlas, ahead of Qwen3.8-27B and Gemma 4 31B in its own table. Qwen3.8-27B still wins some rows, and factual recall is weaker than Inkling 2 Small."
  - "The ~20 GB NVFP4/MXFP8 checkpoint targets one DGX Spark or a 32 GB+ Mac or GPU. It's on Tinker and supported by vLLM, SGLang, Ollama, Unsloth GGUF and llama.cpp. The model card warns it can loop in long reasoning and take destructive actions without asking, so sandbox it."
sources:
  - label: "Thinking Machines Lab — Introducing Inkling 2 Mini (Nov 20, 2026)"
    url: "https://thinkingmachines.ai/news/inkling-2-mini/"
  - label: "Hugging Face — thinkingmachines/Inkling-2-Mini model card"
    url: "https://huggingface.co/thinkingmachines/Inkling-2-Mini"
  - label: "Thinking Machines Lab — Inkling 2 Mini Model Card"
    url: "https://thinkingmachines.ai/model-card/inkling-2-mini/"
  - label: "Hugging Face Blog — Welcome Inkling 2 Mini"
    url: "https://huggingface.co/blog/inkling2mini"
---

Two weeks after [Inkling 2 Small](/articles/thinking-machines-inkling-2-small-594b-moe-open-weights), Thinking Machines Lab has shipped the small one. **Inkling 2 Mini**, released **November 20, 2026**, is a model you can download and run locally. It also does something unusual for an open-weight release: it reuses its own layers.

## What a looped transformer is

Inkling 2 Mini has **24 layers of weights**. The **middle 12 run three times** for every token, with shared weights, so each token passes through **48 layer applications**. Thinking Machines' pitch is that the extra depth lets the model "apply more reasoning and reach the right answer with fewer tokens," which matters most for agentic coding, where reasoning quality decides how many steps a task takes.

The numbers from the model card:

| | Inkling 2 Mini |
| --- | --- |
| Total parameters | 26.4B |
| Active parameters | 3.4B (about 5.4B effective with three passes; each pass adds ~1.0B) |
| Experts | MoE, 8 of 128 experts per token |
| Attention | Hybrid local + global layers |
| Modalities | Text and image in, text out |
| Context | Up to 1M tokens |
| Precision | Natively NVFP4, last four layers MXFP8 |
| Checkpoint size | About 20 GB |
| License | Apache 2.0 |

One catch, spelled out in the card: because the middle layers run three times, **compute per token is higher than the 3.4B active count suggests**. Memory is set by the 26.4B weights. Speed depends on how well your runtime handles loops, and support for looped models in local runtimes is new.

## Benchmarks (vendor-reported)

Thinking Machines says Inkling 2 Mini leads every open-weight model under 100B total parameters on **DeepSWE v1.1 (48.2%)** and **Vals Index v2.2 (46.5%)**. Selected rows from its comparison table:

| Benchmark | Inkling 2 Mini | Qwen3.8-27B | Gemma 4 31B |
| --- | --- | --- | --- |
| DeepSWE v1.1 | 48.2% | 42.2% | 0.3% |
| SWE-Bench Pro v2 (Hard) | 77.9% | 73.8% | 14.2% |
| SWE-Bench Verified (bash only) | 79.2% | 77.8% | 46.1% |
| Terminal Bench v2.1 (pi) | 71.6% | 73.0% | 43.4% |
| MCP Atlas | 82.7% | 77.3% | 54.2% |
| BrowseComp (with compaction) | 79.0% | 61.6% | 37.0% |

It's not a clean sweep. **Qwen3.8-27B** wins Terminal Bench v2.1, GDPVal-AA and AutomationBench, and it has a higher non-hallucination rate on AA-Omniscience (71.4% vs 63.4%). Thinking Machines is open about why: looping improves reasoning but **doesn't add room to store facts**, so knowledge-heavy benchmarks stay in line with other models this size. These are the vendor's own runs with varying harnesses, so check them on your own tasks.

## Why researchers care: reasoning you can't read

Looping lets a model think more **without writing the thinking down**, which cuts against chain-of-thought monitoring. Thinking Machines tested this with a research-only variable-loop model (TML-d24-varloop-research, also on Hugging Face). Going from one pass to three, its no-CoT time horizon rose from 16 to 37 seconds. At five passes, reasoning on GPQA Diamond was less than half as long (1,661 vs 3,703 tokens) but no less legible, and the company saw no upward trend on agentic sabotage tests. It's working with NDIF and Goodfire to give interpretability researchers access.

## Running it

- **Hardware:** the card lists **1× NVIDIA DGX Spark**, **Apple silicon with 32 GB+**, or other GPUs with **32 GB+ VRAM** recommended. The team ran it offline on an M5 Pro MacBook Pro with 48 GB.
- **Runtimes:** Hugging Face Transformers, SGLang, vLLM, TokenSpeed, NVIDIA Dynamo, Unsloth (including GGUF), llama.cpp (GGUF) and Llama App; Ollama and Exo on Apple silicon. Post-training through SkyRL and Miles.
- **Hosted:** inference and fine-tuning on **Tinker**, plus chat in the Tinker Playground.

## Limits the card calls out

The model card is unusually direct about weak spots, and two matter for coding agents:

- **Repetitive reasoning.** It can get stuck re-checking its own work, especially while debugging. Thinking Machines recommends **capping output tokens and agent turns**.
- **Agentic reliability.** It "may take destructive actions, such as deleting or overwriting files, without confirmation." Run it in a sandbox and require approval for irreversible steps.

Quality outside English can also drop. In Chinese, testers saw clipped phrasing and mixed languages.

## Where it fits

A ~20 GB checkpoint with Apache 2.0 weights and SWE-Bench Verified near 79% makes Inkling 2 Mini a strong candidate for a **local executor or subagent model**: running tests, small edits and tool-heavy search while a larger model plans. It isn't the model to trust for factual recall or for working unsupervised in a repo you care about.
