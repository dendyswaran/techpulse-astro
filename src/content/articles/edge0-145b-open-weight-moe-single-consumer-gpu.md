---
title: "Edge0-145B: An Open-Weight 145B Agent Model That Runs on One 24 GB GPU by Streaming Its Experts"
subtitle: "Edge0 rebuilt Qwen3.8-Flash-Next's mixture-of-experts layer so each expert works in a smaller latent space and takes up a fixed 1.63 MB. Its engine keeps the experts it uses most on the GPU and streams the rest from system RAM. On an RTX 5090 D, Edge0 reports 98 to 121 tok/s for agent decoding and 86.5 on Terminal-Bench 2.1. The license limits commercial use."
pubDate: 2026-11-16
category: "ai"
tags: ["Edge0", "Open Weights", "Mixture of Experts", "Local LLM", "NVFP4", "Qwen", "Consumer GPU", "Agentic Coding"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/edge0-145b-open-weight-moe-single-consumer-gpu.webp"
coverAlt: "Risograph-style illustration of a large pale grid of small tiles on a wall with about ten tiles lit in ochre, and thin ink lines running from a few of them to a small terracotta cabinet in the foreground that holds four ochre tiles"
coverCaption: "Illustration by TechPulse Editorial · Keep the busy experts close and fetch the rest when they're needed."
tldr:
  - "Edge0 released Edge0-145B (10.12B active per token) and Edge0-120B (8.64B active) on Hugging Face in Q3_K and NVFP4 builds. Both are derived from Qwen3.8-Flash-Next, with a 256K context and 4-bit native training."
  - "Edge0 says this is a rebuild, not a requantization. Expert inputs are compressed from 2560 to 1792 dimensions on the 145B, which cuts routed expert parameters by 30% to 84.6B. Each expert becomes a fixed 1.63 MB record that the edge0-infer engine caches on the GPU or streams from system RAM."
  - "Edge0's own numbers on an RTX 5090 D 24 GB: 121.2 tok/s agent decode with Q3_K and 98.3 tok/s with NVFP4, using 23 GiB of VRAM plus 31 to 38 GiB of RAM. With a 16 GiB VRAM / 20 GiB RAM cap it reports 44.9 tok/s. Edge0 also reports 86.5 on Terminal-Bench 2.1 and 64.6 on DeepSWE 1.1, ahead of the Qwen base model's 83.3 and 58.7. All figures are vendor-reported."
  - "The license isn't Apache. Personal, research and internal use are allowed, and so is commercial use of outputs. Selling the model, running a commercial model service, or building a commercial coding or office assistant on it needs a separate Edge0 license, and Qwen's license terms still apply."
sources:
  - label: "Hugging Face — Edge0/Edge0-145B-NVFP4 model card"
    url: "https://huggingface.co/Edge0/Edge0-145B-NVFP4"
  - label: "Hugging Face — Edge0/Edge0-145B-q3k model card"
    url: "https://huggingface.co/Edge0/Edge0-145B-q3k"
  - label: "GitHub — Edge0 docs: Edge0 145B and Edge0 120B"
    url: "https://github.com/Edge0-AI/Edge0/blob/main/docs/models/edge0-145b.md"
  - label: "ToolSift — Daily LLM news, 15 November 2026"
    url: "https://toolsift.ai/llm-news/2026-11-15/"
---

Most open models above 100B parameters need datacenter hardware, or at least a Mac with a lot of unified memory. **Edge0-145B** is built to run on **one 24 GB consumer GPU** with ordinary system RAM. Edge0 published it and a smaller **Edge0-120B** on Hugging Face over the weekend, together with its own inference engine.

## A new expert layer, not a requantization

Both models start from **Qwen3.8-Flash-Next**. Edge0 is clear that this isn't a relabel or a requantized copy: it **replaced the routed MoE experts in all 48 layers with a latent MoE**. Each token is projected down to a smaller width (**ℓ = 1792** on the 145B, 1280 on the 120B). The 10 selected experts (out of 512 per layer) and a shared expert run at that width, and the result is projected back to 2560. Because the architecture changed, Edge0 post-trained the model on a long schedule, **natively at 4 bits**.

What this buys you on a local machine:

| | Qwen3.8-Flash-Next | Edge0-145B | Edge0-120B |
| --- | --- | --- | --- |
| Routed expert parameters | 120.8B | 84.6B (−30%) | 60.4B (−50%) |
| Expert parameters per token | 2.36B | 1.65B | 1.18B |
| Expert pool on disk (NVFP4) | 63.2 GiB | 44.3 GiB | 31.6 GiB |
| Decode, 16 GiB VRAM + 20 GiB RAM | 18.5 tok/s | 36.8 tok/s | 62.4 tok/s |

Each expert is now a **fixed 1,630,720-byte record**. The `edge0-infer` engine, built on a fork of Strata, keeps a few thousand experts on the GPU and streams the rest from system RAM, or from SSD with `--mmap-experts`. Speed then depends mostly on **how many experts stay resident** rather than on total model size. A 51.2B-parameter n-gram embedding table (fp8, memory-mapped) and a 1.26B multi-token-prediction head for speculative decoding round out the design.

## Edge0's numbers

All figures below come from Edge0's model card.

| Machine | Build | 16K prefill | Agent decode |
| --- | --- | --- | --- |
| RTX 5090 D 24 GB | Q3_K | 3554.9 tok/s | 121.2 tok/s |
| RTX 5090 D 24 GB | NVFP4 | 3165.7 tok/s | 98.3 tok/s |
| RTX 4090 24 GB | Q3_K | 3179.4 tok/s | 91.7 tok/s |
| Apple M2 Ultra (Metal) | Q3_K | 800.3 tok/s | 57.0 tok/s |
| 5090 D capped to 16 GiB VRAM + 20 GiB RAM | Q3_K | 335 tok/s | 44.9 tok/s |

Memory use on the 5090 D with residency on: **Q3_K takes 23.14 GiB of VRAM plus 31.28 GiB of RAM**, and NVFP4 takes 23.25 GiB plus 38.27 GiB. The 16 GiB row is a cgroup-limited test budget, not an official minimum. That still matters if you have a 16 GB card such as an RTX 5060 Ti or 4080: it's the only measured setup close to that class of hardware. On quality, Edge0 reports **86.5 on Terminal-Bench 2.1** (vs 83.3 for the Qwen base model) and **64.6 on DeepSWE 1.1** (vs 58.7), and roughly equal scores elsewhere. Nobody has reproduced these results independently yet.

## Running it

The NVFP4 build needs CUDA 13 on Linux or Windows. Q3_K also runs on Apple Silicon through Metal. The server exposes **OpenAI- and Anthropic-compatible** endpoints, so you can point coding agents at it:

```bash
git clone https://github.com/Edge0-AI/Edge0.git edge0
# build edge0-strata and edge0-infer per the repo docs, then:
build/cpu/bin/edge0-infer serve --model /path/to/Edge0-145B-q3k
curl localhost:8000/v1/chat/completions -H 'content-type: application/json' \
  -d '{"model":"edge0_145b","messages":[{"role":"user","content":"hi"}],"max_tokens":64}'
```

There's also an **Edge0 Chat** desktop app for Windows, and a vision encoder (`mmproj-BF16.gguf`) that needs a separate `strata-vision` helper. The model card suggests `"reasoning_effort": "none"` for quick answers. Otherwise the model can spend the entire token budget thinking and return nothing.

## Check the license first

The weights are downloadable, but they are **not open source in the Apache sense**. The Edge0 Community Model License 1.0 allows personal use, research, modification, noncommercial sharing, internal use and commercial use of generated outputs. **Selling or bundling the model, running a commercial model service, or offering an independent commercial coding or office assistant** on top of it needs a separate written license from Edge0. Qwen Community License terms apply as well. Using it as a local coding model for your own team is fine. Building a SaaS on it isn't, without a license.

## Why it matters

Expert offloading in llama.cpp and similar runtimes has made big MoE models usable on small GPUs for a while, but usually at single-digit or low-double-digit tokens per second. Edge0's approach is to **change the model so it streams well**: smaller experts, fewer expert bytes per token, and native 4-bit training. If independent tests confirm anything close to 90 to 120 tok/s on a 4090 or 5090, then a strong local executor model for agent loops becomes practical on a single workstation.
